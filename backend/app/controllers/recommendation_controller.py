from typing import Any, Dict, List, Optional
from app.services.recommendation_service import RecommendationService


class RecommendationController:
    """
    Controller for Phase 11 Recommendation Engine API endpoints.
    Pure orchestration: Delegates business logic to RecommendationService.
    """

    def __init__(self, service: Optional[RecommendationService] = None):
        self.service = service or RecommendationService()

    async def handle_generate_recommendations(
        self,
        destination: str,
        travel_style: str = "Culture & Heritage",
        budget_tier: str = "Moderate",
        travelers_type: str = "couple",
        interests: Optional[List[str]] = None,
        user_api_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        return await self.service.generate_recommendations(
            destination=destination,
            travel_style=travel_style,
            budget_tier=budget_tier,
            travelers_type=travelers_type,
            interests=interests,
            user_api_key=user_api_key,
        )

    async def handle_get_category_recommendations(
        self,
        category: str,
        destination: str,
        travel_style: str = "Culture",
        budget_tier: str = "Moderate",
    ) -> Dict[str, Any]:
        full = await self.service.generate_recommendations(
            destination=destination,
            travel_style=travel_style,
            budget_tier=budget_tier,
        )
        recommendations = full.get("recommendations", {})
        category_data = recommendations.get(category, [])
        return {
            "success": True,
            "category": category,
            "destination": destination,
            "items": category_data,
        }
