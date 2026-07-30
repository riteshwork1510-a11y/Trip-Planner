from typing import Optional, List, Dict, Any
from pydantic import BaseModel


class ActivityCreate(BaseModel):
    time: str
    title: str
    location: str = ""
    description: str = ""
    cost: float = 0
    duration: str = ""
    category: str = "activity"
    tips: Optional[str] = None


class ItineraryDayCreate(BaseModel):
    day: Optional[int] = None
    dayNumber: Optional[int] = None
    title: Optional[str] = None
    activities: List[Dict[str, Any]] = []
    hotel: Optional[Dict[str, Any]] = None
    restaurants: Optional[List[Dict[str, Any]]] = None
    transport: Optional[Dict[str, Any]] = None
    travelTime: Optional[str] = None
    notes: Optional[str] = None
    morning: Optional[Dict[str, Any]] = None
    afternoon: Optional[Dict[str, Any]] = None
    evening: Optional[Dict[str, Any]] = None
    stayRecommendation: Optional[str] = None


class TripCreate(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    destination: str
    country: Optional[str] = None
    city: Optional[str] = None
    packageName: Optional[str] = None
    cover_image: Optional[str] = None
    days: int
    nights: int = 0
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: float = 0
    travelers_count: Optional[int] = 0
    travel_style: Optional[str] = None
    food_preference: Optional[str] = None
    interests: List[str] = []
    status: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    # NormalizedTrip stored as-is — no transformation
    full_itinerary: Optional[Dict[str, Any]] = None
    itinerary: List[Dict[str, Any]] = []


class TripUpdate(BaseModel):
    destination: Optional[str] = None
    days: Optional[int] = None
    nights: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: Optional[float] = None
    status: Optional[str] = None
    travel_style: Optional[str] = None
    full_itinerary: Optional[Dict[str, Any]] = None


class ItineraryUpdateRequest(BaseModel):
    prompt: str
