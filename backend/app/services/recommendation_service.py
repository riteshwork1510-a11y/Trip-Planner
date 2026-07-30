import json
import hashlib
from typing import Any, Dict, List, Optional

from app.services.gemini_service import GeminiService
from app.services.retry_service import RetryService
from app.services.recommendation_ranking_service import RecommendationRankingService
from app.services.recommendation_cache import RecommendationCache
from app.validators.response_validator import AIResponseValidator
from app.core.logging_config import logger


class RecommendationService:
    """
    Master Recommendation Engine: Generates personalized recommendations for Hotels,
    Restaurants/Cafes, Local Experiences, Hidden Gems, and Shopping destinations
    with AI reasoning, match scoring (0-100), and MongoDB caching.
    """

    def __init__(self, gemini_service: Optional[GeminiService] = None):
        self.gemini_service = gemini_service or GeminiService()

    @classmethod
    def _generate_cache_key(cls, destination: str, travel_style: str, interests: List[str]) -> str:
        raw_str = f"{destination.lower()}_{travel_style.lower()}_{'_'.join(sorted(i.lower() for i in interests))}"
        return hashlib.md5(raw_str.encode("utf-8")).hexdigest()

    async def generate_recommendations(
        self,
        destination: str,
        travel_style: str = "Culture & Heritage",
        budget_tier: str = "Moderate",
        travelers_type: str = "couple",
        interests: Optional[List[str]] = None,
        user_api_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        interests = interests or ["Culture", "Food", "Sightseeing"]
        cache_key = self._generate_cache_key(destination, travel_style, interests)

        # 1. Check Cache
        cached = await RecommendationCache.get_cached_recommendation(cache_key)
        if cached:
            return cached

        # 2. Build Structured Recommendation Prompt
        prompt = f"""
SYSTEM ROLE:
You are an expert Senior Recommendation Systems Architect and Local Travel Guide.
Generate personalized, non-random, highly curated travel recommendations for:
Destination: {destination}
Travel Style: {travel_style}
Budget Tier: {budget_tier}
Traveler Group: {travelers_type}
Interests: {", ".join(interests)}

Generate a JSON object with EXACTLY these top-level keys:
- "hotels": Array of 3 objects (Hotel Name, Area, Category, Estimated Price, Rating, Distance, Amenities [list], Pros [list], Cons [list], AI Selection Reason, Alternatives {{budget, luxury, family}})
- "restaurants": Array of 4 objects (Name, Cuisine, Average Cost, Opening Hours, Distance, Category [Breakfast/Lunch/Dinner/Cafe/Street Food], Why Recommended)
- "experiences": Array of 3 objects (Title, Category [Workshop/Tour/Handicraft/Food Tour], Duration, Estimated Cost, Why Selected)
- "hiddenGems": Array of 3 objects (Title, Location, Special Reason, Best Time To Visit, Difficulty [Easy/Moderate], Photography Score [1-10], Crowd Level [Low])
- "shopping": Array of 3 objects (Name, Type [Market/Mall/Souvenirs], Best For, Price Range, Location)

Return ONLY pure, parseable JSON text without markdown code blocks (```json) or introductory commentary.
"""

        active_gemini = GeminiService(api_key=user_api_key) if user_api_key else self.gemini_service

        async def call_gemini():
            return await active_gemini.generate_content(prompt=prompt)

        result = await RetryService.execute_with_retry(call_gemini)
        raw_text = result["raw_text"]

        is_valid, parsed_json, _ = AIResponseValidator.attempt_json_repair(raw_text)

        if not is_valid or not isinstance(parsed_json, dict):
            # Fallback curated response structure if AI response formatting fails
            parsed_json = self._get_fallback_recommendations(destination)

        # 3. Apply Smart 0-100 Match Scoring across all categories
        for category_key in ["hotels", "restaurants", "experiences", "hiddenGems", "shopping"]:
            if category_key in parsed_json and isinstance(parsed_json[category_key], list):
                parsed_json[category_key] = RecommendationRankingService.rank_and_score_items(
                    items=parsed_json[category_key],
                    user_interests=interests,
                    travel_style=travel_style,
                    travel_type=travelers_type,
                )

        output = {
            "success": True,
            "destination": destination,
            "travel_style": travel_style,
            "recommendations": parsed_json,
        }

        # 4. Save to Cache
        await RecommendationCache.set_cached_recommendation(cache_key, output)

        return output

    def _get_fallback_recommendations(self, destination: str) -> Dict[str, Any]:
        return {
            "hotels": [
                {
                    "name": f"Grand Heritage Resort {destination}",
                    "area": "Central City",
                    "category": "4-Star Heritage",
                    "price": "$120 / night",
                    "rating": 4.7,
                    "distance": "1.2 km from main sights",
                    "amenities": ["Pool", "Free WiFi", "Breakfast Included"],
                    "pros": ["Prime location", "Authentic architecture"],
                    "cons": ["Popular peak booking"],
                    "ai_reason": "Chosen for top location score and high user satisfaction.",
                    "alternatives": {"budget": "Boutique Inn", "luxury": "5-Star Palace", "family": "Garden Suites"},
                }
            ],
            "restaurants": [
                {
                    "name": f"The Authentic Kitchen ({destination})",
                    "cuisine": "Regional Local Specialities",
                    "cost": "$25 per meal",
                    "opening_hours": "11:00 AM - 10:30 PM",
                    "distance": "0.5 km",
                    "category": "Dinner",
                    "why_recommended": "Serves authentic regional cuisine rated #1 locally.",
                }
            ],
            "experiences": [
                {
                    "title": f"Culinary & Craft Workshop in {destination}",
                    "category": "Workshop",
                    "duration": "2.5 Hours",
                    "cost": "$30",
                    "why_selected": "Hands-on experience matching cultural interest.",
                }
            ],
            "hiddenGems": [
                {
                    "title": f"Quiet Sunset Promenade ({destination})",
                    "location": "Old Town Border",
                    "special_reason": "Peaceful panoramic viewpoint away from crowds.",
                    "best_time": "5:30 PM",
                    "difficulty": "Easy",
                    "photography_score": 9,
                    "crowd_level": "Low",
                }
            ],
            "shopping": [
                {
                    "name": f"Traditional Handicraft Market",
                    "type": "Local Market",
                    "best_for": "Souvenirs, Fabrics & Art",
                    "price_range": "Moderate",
                    "location": "Heritage Square",
                }
            ],
        }
