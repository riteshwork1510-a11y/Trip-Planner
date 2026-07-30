from typing import List, Optional
from fastapi import APIRouter, Query, status, Body

from app.controllers.recommendation_controller import RecommendationController

router = APIRouter(prefix="/api/v1/recommendations", tags=["Personalized Recommendation Engine"])
controller = RecommendationController()


@router.post(
    "/generate",
    status_code=status.HTTP_200_OK,
    summary="Generate personalized recommendations across all categories",
    description="Generates scored & AI-explained recommendations for Hotels, Restaurants, Experiences, Hidden Gems, and Shopping.",
)
async def generate_recommendations_endpoint(
    destination: str = Body(..., embed=True),
    travel_style: str = Body(default="Culture & Heritage", embed=True),
    budget_tier: str = Body(default="Moderate", embed=True),
    travelers_type: str = Body(default="couple", embed=True),
    interests: Optional[List[str]] = Body(default=None, embed=True),
    user_api_key: Optional[str] = Body(default=None, embed=True),
):
    return await controller.handle_generate_recommendations(
        destination=destination,
        travel_style=travel_style,
        budget_tier=budget_tier,
        travelers_type=travelers_type,
        interests=interests,
        user_api_key=user_api_key,
    )


@router.get(
    "/hotels",
    status_code=status.HTTP_200_OK,
    summary="Get recommended hotels",
)
async def get_hotels_endpoint(destination: str = Query(...), travel_style: str = Query(default="Culture")):
    return await controller.handle_get_category_recommendations(
        category="hotels", destination=destination, travel_style=travel_style
    )


@router.get(
    "/restaurants",
    status_code=status.HTTP_200_OK,
    summary="Get recommended restaurants & cafes",
)
async def get_restaurants_endpoint(destination: str = Query(...), travel_style: str = Query(default="Food")):
    return await controller.handle_get_category_recommendations(
        category="restaurants", destination=destination, travel_style=travel_style
    )


@router.get(
    "/experiences",
    status_code=status.HTTP_200_OK,
    summary="Get local experiences & workshops",
)
async def get_experiences_endpoint(destination: str = Query(...), travel_style: str = Query(default="Culture")):
    return await controller.handle_get_category_recommendations(
        category="experiences", destination=destination, travel_style=travel_style
    )


@router.get(
    "/shopping",
    status_code=status.HTTP_200_OK,
    summary="Get shopping places & local markets",
)
async def get_shopping_endpoint(destination: str = Query(...), travel_style: str = Query(default="Shopping")):
    return await controller.handle_get_category_recommendations(
        category="shopping", destination=destination, travel_style=travel_style
    )


@router.get(
    "/hidden-gems",
    status_code=status.HTTP_200_OK,
    summary="Get off-the-beaten-path hidden gems",
)
async def get_hidden_gems_endpoint(destination: str = Query(...), travel_style: str = Query(default="Nature")):
    return await controller.handle_get_category_recommendations(
        category="hiddenGems", destination=destination, travel_style=travel_style
    )
