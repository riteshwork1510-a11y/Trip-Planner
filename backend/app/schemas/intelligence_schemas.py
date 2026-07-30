from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class PlaceInfo(BaseModel):
    id: str
    name: str
    category: str
    latitude: float
    longitude: float
    address: str
    opening_hours: str = "06:00 AM"
    closing_hours: str = "08:00 PM"
    estimated_visit_duration: str = "1.5 Hours"
    ticket_price: str = "Free"
    best_time_to_visit: str = "Morning / Evening"
    popularity_score: float = 4.8
    average_rating: float = 4.7
    travel_difficulty: str = "Easy"
    family_friendly: bool = True
    wheelchair_accessible: bool = True
    photography_friendly: bool = True
    short_description: str


class DistanceMatrixEntry(BaseModel):
    from_place: str
    to_place: str
    distance_km: float
    travel_time_mins: int
    recommended_transport: str = "Taxi / Auto"
    estimated_cost: str = "₹100 - ₹200"


class HotelInfo(BaseModel):
    name: str
    area: str
    category: str
    price_per_night: str
    rating: float
    amenities: List[str] = []
    distance_from_attractions: str


class RestaurantInfo(BaseModel):
    name: str
    meal_type: str  # Breakfast, Lunch, Dinner, Street Food
    cuisine: str
    estimated_cost: str
    is_vegetarian: bool = True
    nearby_attraction: str


class ShoppingInfo(BaseModel):
    market_name: str
    specialty: str
    location: str
    opening_hours: str


class ExperienceInfo(BaseModel):
    title: str
    category: str
    description: str
    duration: str


class DestinationClassification(BaseModel):
    destination_type: str
    allowed_styles: List[str]
    forbidden_activities: List[str]


class DestinationKnowledgeGraph(BaseModel):
    destination: str
    duration_days: int
    budget_per_person: float
    travel_style: str
    travelers_count: int
    interests: List[str]
    attractions: List[PlaceInfo]
    distance_matrix: List[DistanceMatrixEntry]
    hotels: List[HotelInfo]
    restaurants: List[RestaurantInfo]
    shopping: List[ShoppingInfo]
    local_experiences: List[ExperienceInfo]
    classification: Optional[DestinationClassification] = None



class IntelligenceRequest(BaseModel):
    destination: str
    duration_days: int = 5
    budget_per_person: float = 20000.0
    travel_style: str = "Spiritual, Photography, Culture"
    travelers_count: int = 2
    interests: List[str] = Field(default_factory=lambda: [])
    accommodation_pref: str = "Standard"
    food_pref: str = "Vegetarian"
    transport_mode: str = "Car"
    special_requirements: str = ""
    user_api_key: Optional[str] = None


class IntelligenceResponse(BaseModel):
    success: bool
    destination: str
    knowledge_graph: DestinationKnowledgeGraph
    context_prompt: str
    generated_itinerary: Optional[Dict[str, Any]] = None
