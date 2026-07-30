from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


# ── INPUT SCHEMAS ──────────────────────────────────────────────

class AIChatRequest(BaseModel):
    conversation_id: Optional[str] = Field(default=None, description="Existing conversation ID or None for new session")
    message: str = Field(..., min_length=1, max_length=4096, description="User prompt or chat message")
    context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Travel context metadata")
    user_api_key: Optional[str] = Field(default=None, description="Optional client Gemini API key override")

    @field_validator("message")
    @classmethod
    def sanitize_message(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Message prompt cannot be empty or blank")
        return s


class TripGenerationRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=150, description="Target travel destination")
    country: Optional[str] = Field(default=None, description="Target country")
    state: Optional[str] = Field(default=None, description="Target state or province")
    city: Optional[str] = Field(default=None, description="Target city")
    duration_days: int = Field(..., ge=1, le=30, description="Trip duration in days (1 to 30)")
    duration_nights: Optional[int] = Field(default=None, description="Trip duration in nights")
    total_budget: Optional[float] = Field(default=None, ge=0, description="Total allocated budget")
    budget_per_person: Optional[float] = Field(default=None, ge=0, description="Budget per person")
    currency: str = Field(default="USD", description="Currency symbol/code")
    travelers_count: int = Field(default=2, ge=1, le=50, description="Number of travelers")
    travel_type: str = Field(default="couple", description="solo, couple, family, friends, corporate, senior_citizens, children")
    travel_style: str = Field(default="moderate", description="luxury, budget, adventure, nature, photography, history, culture, food, shopping, wildlife, pilgrimage, road_trip, relaxation")
    interests: List[str] = Field(default_factory=list, description="List of travel interests")
    preferred_transport: Optional[str] = Field(default="flight_and_taxi", description="Preferred transport mode")
    preferred_hotel_category: Optional[str] = Field(default="4_star", description="Preferred hotel tier")
    special_requirements: Optional[str] = Field(default=None, max_length=1000, description="Accessibility or dietary requirements")
    starting_location: Optional[str] = Field(default=None, description="Origin / Starting location")
    preferred_pace: str = Field(default="balanced", description="relaxed, balanced, fast")
    preferred_language: str = Field(default="English", description="Language for generated itinerary")
    user_api_key: Optional[str] = Field(default=None, description="Optional client Gemini API key override")

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, v: str) -> str:
        s = v.strip()
        if not s:
            raise ValueError("Destination cannot be empty")
        return s

    @field_validator("duration_days")
    @classmethod
    def validate_duration(cls, v: int) -> int:
        if v < 1 or v > 30:
            raise ValueError("Duration must be between 1 and 30 days")
        return v


class RegenerateRequest(BaseModel):
    target_id: str = Field(..., description="Generation ID or Trip ID to regenerate")
    action_type: str = Field(default="trip_generation", description="trip_generation or chat")
    feedback: Optional[str] = Field(default=None, max_length=1000, description="Specific feedback or adjustments requested")
    user_api_key: Optional[str] = Field(default=None, description="Optional client Gemini API key override")


# ── OUTPUT SCHEMAS FOR STRUCTURED ITINERARY ───────────────────

class TripSummary(BaseModel):
    destination: str
    duration: str
    travelStyle: str
    estimatedBudget: str
    bestSeason: str
    overallTheme: str
    tripDifficulty: str
    averageDailyTravelTime: str
    recommendedPace: str


class TripHighlight(BaseModel):
    title: str
    description: str
    whyIncluded: str


class ActivityDetail(BaseModel):
    id: str
    timeSlot: str  # Morning, Afternoon, Evening, Night
    title: str
    description: str
    location: str
    estimatedCost: str
    category: str
    tips: Optional[str] = None


class DailyItineraryDay(BaseModel):
    dayNumber: int
    title: str
    morning: ActivityDetail
    afternoon: ActivityDetail
    lunch: ActivityDetail
    evening: ActivityDetail
    dinner: ActivityDetail
    night: ActivityDetail
    estimatedCost: str
    travelDistance: str
    travelTime: str
    stayRecommendation: str
    importantNotes: Optional[str] = None


class BudgetBreakdownDetailed(BaseModel):
    accommodation: str
    food: str
    transportation: str
    entryFees: str
    shoppingBuffer: str
    emergencyBuffer: str
    totalCost: str
    remainingBudget: str
    currency: str


class HotelRecommendation(BaseModel):
    hotelName: str
    hotelArea: str
    hotelCategory: str
    estimatedPrice: str
    reasonForRecommendation: str
    nearbyAttractions: List[str]


class RestaurantOption(BaseModel):
    restaurantName: str
    cuisine: str
    estimatedCost: str
    reason: str
    nearbyAttraction: str


class RestaurantRecommendation(BaseModel):
    breakfast: RestaurantOption
    lunch: RestaurantOption
    dinner: RestaurantOption


class TransportOption(BaseModel):
    mode: str  # Walking, Auto, Taxi, Bus, Metro, Train, Rental Car
    travelTime: str
    estimatedCost: str
    reason: str


class PackingChecklist(BaseModel):
    clothing: List[str]
    electronics: List[str]
    documents: List[str]
    health: List[str]
    weatherItems: List[str]
    photography: List[str]
    localEssentials: List[str]


class TravelTips(BaseModel):
    localCustoms: List[str]
    dressCode: List[str]
    safety: List[str]
    weather: List[str]
    photographyEtiquette: List[str]
    festivalInformation: Optional[List[str]] = []
    languageTips: List[str]


class FullItineraryOutput(BaseModel):
    tripSummary: TripSummary
    tripHighlights: List[TripHighlight]
    dailyItinerary: List[DailyItineraryDay]
    budgetBreakdown: BudgetBreakdownDetailed
    hotelRecommendation: List[HotelRecommendation]
    restaurantRecommendation: RestaurantRecommendation
    transportRecommendation: List[TransportOption]
    packingChecklist: PackingChecklist
    travelTips: TravelTips
    emergencyAdvice: List[str]
    weatherAdvice: str
    importantNotes: List[str]


# ── RESPONSE SCHEMAS ──────────────────────────────────────────

class AIChatResponse(BaseModel):
    success: bool = True
    conversation_id: str
    message_id: str
    reply: str
    status: str = "completed"
    model_used: str
    latency_ms: float
    created_at: datetime = Field(default_factory=datetime.utcnow)


class TripGenerationResponse(BaseModel):
    success: bool = True
    generation_id: str
    request_id: str
    destination: str
    status: str = "completed"
    model_used: str
    validated_output: Dict[str, Any]
    latency_ms: float
    created_at: datetime = Field(default_factory=datetime.utcnow)


class HistoryItem(BaseModel):
    id: str
    type: str
    title: str
    summary: Optional[str] = None
    created_at: datetime
    status: str


class HistoryListResponse(BaseModel):
    success: bool = True
    total_count: int
    items: List[HistoryItem]


class HistoryDetailResponse(BaseModel):
    success: bool = True
    id: str
    type: str
    data: Dict[str, Any]
    created_at: datetime


class GenericSuccessResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[Dict[str, Any]] = None
