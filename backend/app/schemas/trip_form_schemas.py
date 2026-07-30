from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, field_validator

class TripFormRequest(BaseModel):
    destination: str = "Pavagadh"
    start_date: Optional[str] = "2026-08-12"
    end_date: Optional[str] = "2026-08-15"
    duration_days: int = 4
    duration_nights: int = 3
    adults: int = 2
    children: int = 0
    infants: int = 0
    seniors: int = 0
    total_travelers: int = 2
    budget_tier: Optional[str] = "Standard"
    budget_per_person: float = 20000.0
    travel_styles: Union[List[str], str] = Field(default_factory=lambda: ["Culture", "Leisure"])
    interests: Union[List[str], str] = Field(default_factory=lambda: ["Sightseeing"])
    accommodation_pref: Optional[str] = "Standard"
    food_pref: Optional[str] = "Vegetarian"
    transport_mode: Union[List[str], str] = Field(default_factory=lambda: ["Car"])
    special_requirements: Union[List[str], str] = Field(default_factory=lambda: [])
    preferred_pace: Optional[str] = "Moderate"
    accessibility_req: Optional[str] = "None"
    child_senior_info: Optional[str] = None
    language_pref: Optional[str] = "English"
    currency: Optional[str] = "INR"
    user_api_key: Optional[str] = None

    @field_validator("duration_days", "duration_nights", "adults", "children", "infants", "seniors", "total_travelers", mode="before")
    def coerce_int(cls, v: Any) -> int:
        try:
            val = int(v)
            return val if val >= 1 else 1
        except (ValueError, TypeError):
            return 1

    @field_validator("budget_per_person", mode="before")
    def coerce_float(cls, v: Any) -> float:
        try:
            return float(v)
        except (ValueError, TypeError):
            return 5000.0

    @field_validator("travel_styles", "interests", "transport_mode", "special_requirements", mode="before")
    def coerce_to_list(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [s.strip() for s in v.split(",") if s.strip()]
        if isinstance(v, list):
            return [str(x) for x in v if x is not None]
        return []

class TripModifyRequest(BaseModel):
    trip_id: str
    instruction: str
    version_number: int = 1
    user_api_key: Optional[str] = None

class TripFormResponse(BaseModel):
    success: bool
    trip_id: str
    destination: str
    version_number: int = 1
    itinerary: Dict[str, Any]
