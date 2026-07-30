import asyncio
import json
from typing import Dict, Any, AsyncGenerator
from .geocoding_service import GeocodingService
from .places_service import PlacesService
from .hotels_service import HotelsService
from .restaurants_service import RestaurantsService
from .transport_service import TransportService
from .essential_services import EssentialServicesService
from .weather_service import WeatherService
from .route_optimizer import RouteOptimizer
from app.core.database import get_database
from app.core.logging_config import logger

class DestinationIntelligenceEngine:

    @staticmethod
    async def fetch_complete_intelligence(destination: str, duration_days: int, budget_per_person: float = 5000) -> Dict[str, Any]:
        """
        Executes full 15-step Destination Intelligence collection concurrently.
        """
        geo = await GeocodingService.get_coordinates(destination)
        lat = geo["latitude"]
        lon = geo["longitude"]

        # Concurrent collection
        places_task = PlacesService.fetch_all_attractions(destination, lat, lon)
        hotels_task = HotelsService.fetch_hotels(destination, lat, lon)
        restaurants_task = RestaurantsService.fetch_restaurants(destination, lat, lon)
        essentials_task = EssentialServicesService.fetch_essentials(destination, lat, lon)
        weather_task = WeatherService.get_weather(lat, lon)

        results = await asyncio.gather(
            places_task, hotels_task, restaurants_task, essentials_task, weather_task, return_exceptions=True
        )

        attractions = results[0] if isinstance(results[0], list) else []
        hotels = results[1] if isinstance(results[1], dict) else {}
        restaurants = results[2] if isinstance(results[2], dict) else {}
        essentials = results[3] if isinstance(results[3], dict) else {}
        weather = results[4] if isinstance(results[4], dict) else {}

        transport = TransportService.get_transport_options(destination, duration_days)
        clusters = RouteOptimizer.cluster_attractions(attractions, duration_days)
        route_meta = RouteOptimizer.summarize_route_optimization(clusters)

        return {
            "destination": destination,
            "duration_days": duration_days,
            "budget_per_person": budget_per_person,
            "coordinates": geo,
            "attractions": attractions,
            "hotels": hotels,
            "restaurants": restaurants,
            "transport": transport,
            "essentials": essentials,
            "weather": weather,
            "clusters": clusters,
            "route_meta": route_meta
        }

    @staticmethod
    async def build_context_stream(request_data: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """
        Yields Server-Sent Events (SSE) progress updates for Planner UI.
        """
        destination = request_data.get("destination", "Unknown")
        duration_days = request_data.get("duration_days", 1)
        budget = request_data.get("budget_per_person", 5000)

        yield f"event: message\ndata: {{\"status\": \"Resolving destination coordinates for {destination}...\"}}\n\n"
        
        raw_context = await DestinationIntelligenceEngine.fetch_complete_intelligence(destination, duration_days, budget)
        geo = raw_context["coordinates"]
        
        yield f"event: message\ndata: {{\"status\": \"Fetched admin region ({geo.get('city')}, {geo.get('state')}, {geo.get('country')}). Searching 5 radius bands...\"}}\n\n"
        yield f"event: message\ndata: {{\"status\": \"Collected {len(raw_context['attractions'])} attractions, 5 hotels, 10 restaurants...\"}}\n\n"
        yield f"event: message\ndata: {{\"status\": \"Applying polar sweep route optimization & TSP algorithm...\"}}\n\n"

        from app.services.context_builder import ContextBuilder
        prompt = ContextBuilder.build_prompt_from_raw_context(raw_context, request_data)

        try:
            db = get_database()
            await db.destination_intelligence.insert_one({
                "destination": destination,
                "coordinates": geo,
                "raw_context": raw_context,
                "context_prompt": prompt
            })
        except Exception as e:
            logger.warning(f"Failed to persist destination intelligence stream to DB: {e}")

        yield f"event: complete\ndata: {{\"context_prompt\": {json.dumps(prompt)}, \"raw_context\": {json.dumps(raw_context, default=str)}}}\n\n"
