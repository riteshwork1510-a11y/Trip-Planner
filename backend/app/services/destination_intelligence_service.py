import hashlib
import json
from typing import Any, Dict, Optional
from datetime import datetime

from app.schemas.intelligence_schemas import (
    IntelligenceRequest,
    IntelligenceResponse,
    DestinationKnowledgeGraph,
)
from app.services.destination_collectors import (
    PlaceCollector,
    HotelCollector,
    RestaurantCollector,
    ShoppingCollector,
    ExperienceCollector,
    InsufficientDataException,
)
from app.services.ranking_and_day_planner import RankingEngine, DayPlanner
from app.services.distance_matrix_service import DistanceMatrixService
from app.services.context_builder import ContextBuilder
from app.services.gemini_service import GeminiService
from app.services.destination_classifier import DestinationClassifier

from app.services.retry_service import RetryService
from app.validators.response_validator import AIResponseValidator
from app.core.database import get_database
from app.core.logging_config import logger


class DestinationIntelligenceService:
    """
    Master Coordinator for the Destination Intelligence Engine.
    Collects real destination data, computes distance matrices, ranks attractions,
    assembles Destination Knowledge Graphs, caches graph data in MongoDB, and executes
    zero-hallucination Gemini itinerary generation.
    """

    @classmethod
    async def build_knowledge_graph(cls, request: IntelligenceRequest) -> DestinationKnowledgeGraph:
        # 1. Collect real destination attractions
        try:
            raw_attractions = PlaceCollector.collect_attractions(request.destination)
        except InsufficientDataException as e:
            logger.error(f"Insufficient Data: {e}")
            raise e

        # 2. Intelligently rank attractions
        ranked_attractions = RankingEngine.rank_attractions(raw_attractions, request.interests)

        # 3. Generate pairwise distance & transit matrix
        distance_matrix = DistanceMatrixService.generate_distance_matrix(ranked_attractions)

        # 4. Collect Hotels, Restaurants, Shopping & Experiences
        hotels = HotelCollector.collect_hotels(request.destination, request.budget_per_person)
        restaurants = RestaurantCollector.collect_restaurants(request.destination)
        shopping = ShoppingCollector.collect_shopping(request.destination)
        experiences = ExperienceCollector.collect_experiences(request.destination)

        graph = DestinationKnowledgeGraph(
            destination=request.destination,
            duration_days=request.duration_days,
            budget_per_person=request.budget_per_person,
            travel_style=request.travel_style,
            travelers_count=request.travelers_count,
            interests=request.interests,
            attractions=ranked_attractions,
            distance_matrix=distance_matrix,
            hotels=hotels,
            restaurants=restaurants,
            shopping=shopping,
            local_experiences=experiences,
        )

        # 5. Classify the destination to enforce travel style boundaries
        graph.classification = DestinationClassifier.classify(graph)
        return graph


    @classmethod
    async def build_context_and_generate(cls, request: IntelligenceRequest) -> IntelligenceResponse:
        # 1. Build or retrieve cached Destination Knowledge Graph
        graph = await cls.build_knowledge_graph(request)

        # 2. Build structured prompt context for Gemini
        context_prompt = ContextBuilder.build_enriched_prompt(graph)

        # 3. Cache knowledge graph in MongoDB
        db = get_database()
        cache_key = hashlib.md5(f"{request.destination.lower()}_{request.duration_days}_{request.budget_per_person}".encode()).hexdigest()
        try:
            await db.destination_intelligence_cache.update_one(
                {"cache_key": cache_key},
                {
                    "$set": {
                        "cache_key": cache_key,
                        "destination": request.destination,
                        "knowledge_graph": graph.model_dump(),
                        "context_prompt": context_prompt,
                        "updated_at": datetime.utcnow(),
                    }
                },
                upsert=True,
            )
        except Exception as e:
            logger.warning(f"Failed to cache destination intelligence in MongoDB: {e}")

        # 4. Execute Gemini request using GeminiService with Self-Validation Loop
        gemini = GeminiService(api_key=request.user_api_key)
        
        parsed_data = None
        max_attempts = 3
        attempt = 1
        
        while attempt <= max_attempts:
            try:
                async def call_gemini():
                    # Send prompt with potential validation feedback
                    return await gemini.generate_content(prompt=context_prompt)
    
                res = await RetryService.execute_with_retry(call_gemini)
                raw_text = res["raw_text"]
                is_valid_json, data, json_msg = AIResponseValidator.attempt_json_repair(raw_text)
    
                if is_valid_json and isinstance(data, dict):
                    # Schema validation
                    schema_ok, schema_missing = AIResponseValidator.validate_trip_schema(data)
                    
                    if schema_ok:
                        # Self Validation against Knowledge Graph
                        graph_ok, graph_errors = AIResponseValidator.validate_itinerary_against_graph(data, graph)
                        
                        if graph_ok:
                            # Strict duplicate check
                            all_activities = []
                            has_duplicates = False
                            for day in data.get("dailyItinerary", []):
                                for act in day.get("activities", []):
                                    name = act.get("placeName", "").lower().strip()
                                    if name in all_activities:
                                        has_duplicates = True
                                        break
                                    all_activities.append(name)
                                if has_duplicates:
                                    break
                            
                            if has_duplicates:
                                logger.warning(f"Self-validation failed on attempt {attempt}: Found duplicate attractions in generated JSON.")
                                context_prompt += f"\n\nERROR IN PREVIOUS OUTPUT: You generated duplicate attractions. REGENERATE ITINERARY USING ONLY UNIQUE VERIFIED NEARBY LOCATIONS FROM THE PROVIDED DATA. NO HALLUCINATIONS. NO REPEATS."
                            else:
                                parsed_data = data
                                break
                        else:
                            logger.warning(f"Self-validation failed on attempt {attempt}: {graph_errors}")
                            context_prompt += f"\n\nERROR IN PREVIOUS OUTPUT: {', '.join(graph_errors)}\nREGENERATE ITINERARY USING ONLY VERIFIED NEARBY LOCATIONS FROM THE PROVIDED DATA. NO HALLUCINATIONS. NO REPEATS."
                    else:
                        logger.warning(f"Schema validation failed on attempt {attempt}: Missing {schema_missing}")
                else:
                    logger.warning(f"JSON parsing failed on attempt {attempt}: {json_msg}")
                    
            except Exception as err:
                logger.warning(f"Gemini API call failed on attempt {attempt} ({err}).")
                
            attempt += 1

        if not parsed_data:
            logger.warning("All generation attempts failed or were rejected by self-validation. Falling back to graph generator.")
            parsed_data = cls._generate_fallback_from_graph(graph)

        return IntelligenceResponse(
            success=True,
            destination=request.destination,
            knowledge_graph=graph,
            context_prompt=context_prompt,
            generated_itinerary=parsed_data,
        )

    @classmethod
    def _generate_fallback_from_graph(cls, graph: DestinationKnowledgeGraph) -> Dict[str, Any]:
        """Direct fallback generator built strictly from the Destination Knowledge Graph."""
        clustered = DayPlanner.cluster_attractions_into_days(
            graph.attractions, graph.distance_matrix, graph.duration_days
        )
        curr_symbol = "₹"
        days = []

        from app.schemas.intelligence_schemas import PlaceInfo
        default_place = PlaceInfo(
            id="default-1",
            name=f"Explore {graph.destination}",
            category="General",
            latitude=0.0,
            longitude=0.0,
            address=graph.destination,
            short_description="Self-guided exploration of the local area."
        )

        for day_num in range(1, graph.duration_days + 1):
            attraction_list = clustered.get(day_num, [])
            morning_p = attraction_list[0] if len(attraction_list) > 0 else (graph.attractions[0] if graph.attractions else default_place)
            afternoon_p = attraction_list[1] if len(attraction_list) > 1 else (graph.attractions[1] if len(graph.attractions) > 1 else morning_p)
            evening_p = attraction_list[2] if len(attraction_list) > 2 else morning_p

            days.append({
                "dayNumber": day_num,
                "title": f"Day {day_num}: {morning_p.name} & Local Sights",
                "morning": {
                    "title": morning_p.name,
                    "description": morning_p.short_description,
                    "estimatedCost": morning_p.ticket_price,
                    "location": morning_p.address,
                },
                "afternoon": {
                    "title": afternoon_p.name,
                    "description": afternoon_p.short_description,
                    "estimatedCost": afternoon_p.ticket_price,
                    "location": afternoon_p.address,
                },
                "lunch": {
                    "title": graph.restaurants[0].name if graph.restaurants else "Local Thali Spot",
                    "description": graph.restaurants[0].cuisine if graph.restaurants else "Traditional meal",
                    "estimatedCost": graph.restaurants[0].estimated_cost if graph.restaurants else f"{curr_symbol}350",
                    "location": graph.destination,
                },
                "evening": {
                    "title": evening_p.name,
                    "description": evening_p.short_description,
                    "estimatedCost": evening_p.ticket_price,
                    "location": evening_p.address,
                },
                "dinner": {
                    "title": graph.restaurants[-1].name if graph.restaurants else "Haveli Dinner",
                    "description": "Traditional cuisine",
                    "estimatedCost": f"{curr_symbol}400",
                    "location": graph.destination,
                },
                "stayRecommendation": graph.hotels[0].name if graph.hotels else f"Heritage Hotel {graph.destination}",
            })

        return {
            "tripSummary": f"Customized {graph.duration_days}-day {graph.travel_style} trip to {graph.destination} built directly from Destination Intelligence Graph.",
            "tripHighlights": [p.name for p in graph.attractions[:4]],
            "dailyItinerary": days,
            "travelTips": {
                "localCustoms": ["Prebook tickets and respect local temple attire."],
                "safety": ["Keep emergency contact numbers saved."],
            },
            "budgetBreakdown": {
                "totalCost": f"{curr_symbol}{graph.budget_per_person * graph.travelers_count}",
                "currency": "INR",
            },
        }
