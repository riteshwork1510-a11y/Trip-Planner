from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field


class ActivityModel(BaseModel):
    id: Optional[str] = None
    time: str
    title: str
    location: str
    description: str
    cost: float = 0
    duration: str = ""
    category: str = "activity"


class ItineraryDayModel(BaseModel):
    day: int
    title: str
    activities: List[ActivityModel] = []


class TripPreferencesModel(BaseModel):
    food_preference: Optional[str] = None
    interests: List[str] = []
    budget: float = 0
    travel_style: Optional[str] = None


class TripModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    destination: str
    country: Optional[str] = None
    cover_image: Optional[str] = None
    days: int
    nights: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    budget: float = 0
    spent: float = 0
    travel_style: Optional[str] = None
    status: str = "upcoming"
    itinerary: List[ItineraryDayModel] = []
    preferences: Optional[TripPreferencesModel] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
