import json
from typing import Any, Dict, List, Optional
from app.schemas.ai_schemas import TripGenerationRequest


class PromptBuilder:
    """
    Constructs comprehensive, structured, and standardized prompt templates for Gemini AI.
    Guarantees strict JSON output conforming to Phase 8 & Phase 10 requirements.
    """

    SYSTEM_ROLE_INSTRUCTION = (
        "You are an expert Principal AI Travel Planner, Senior GIS Specialist, and Cultural Travel Architect. "
        "Your task is to generate or modify travel itineraries cleanly, realistically, and with geographical precision. "
        "AI DECISION RULES TO ENFORCE STRICTLY:\n"
        "1. Avoid duplicate attractions across all days.\n"
        "2. Respect realistic opening hours and daily time constraints.\n"
        "3. Group geographically nearby attractions together to minimize transit time.\n"
        "4. Balance busy and relaxed days based on the user's preferred daily pace.\n"
        "5. Provide meal suggestions located near the surrounding attractions of that time slot.\n"
        "6. Provide stay/hotel recommendations near the final attraction of each day.\n"
        "7. Calculate exact budget allocations and ensure Total Cost does not exceed the User Budget.\n"
        "8. Never include markdown formatting, backticks (```json), HTML tags, or conversational intro/outro text. "
        "Return ONLY pure, parseable JSON text."
    )

    @classmethod
    def build_trip_generation_prompt(cls, request: TripGenerationRequest) -> str:
        interests_str = ", ".join(request.interests) if request.interests else "General Sightseeing, Culture, Food"
        special_reqs = request.special_requirements or "None"
        nights = request.duration_nights if request.duration_nights is not None else max(0, request.duration_days - 1)
        total_budget_val = f"{request.currency} {request.total_budget}" if request.total_budget else "Flexible / Optimized"
        budget_per_person_val = f"{request.currency} {request.budget_per_person}" if request.budget_per_person else "Flexible"

        output_json_schema = """{
  "destinationOverview": {
    "destination": "String - Full destination name",
    "bestTime": "String - Best months to visit",
    "currentWeather": "String - Expected typical weather",
    "temperature": "String - Average temp range",
    "currency": "String - Currency info",
    "language": "String - Local languages",
    "famousFor": "String - Short description of fame",
    "mapCoordinates": "String - Lat, Lng"
  },
  "tripHighlights": {
    "top10Attractions": ["String"],
    "hiddenGems": ["String"],
    "unescoSites": ["String"],
    "localFestivals": ["String"],
    "famousFood": ["String"],
    "bestSunset": ["String"],
    "bestSunrise": ["String"],
    "shopping": ["String"],
    "adventure": ["String"],
    "photographySpots": ["String"]
  },
  "routeOptimization": {
    "summary": "String - Overview of routing strategy",
    "totalDistance": "String",
    "totalTravelTime": "String",
    "fuelEstimate": "String",
    "avoidBacktrackingStrategy": "String"
  },
  "dailyItinerary": [
    {
      "dayNumber": 1,
      "title": "Day 1 Title",
      "activities": [
        {
          "placeName": "String",
          "address": "String",
          "distance": "String - From previous spot",
          "travelTime": "String - Transit time",
          "rating": "String - e.g. 4.8",
          "openingHours": "String",
          "entryFee": "String",
          "bestTime": "String - e.g. Morning",
          "expectedDuration": "String",
          "coordinates": "String - Lat, Lng"
        }
      ]
    }
  ],
  "nearbyAttractions": [
    {
      "primaryAttraction": "String - Name of main spot",
      "within2km": ["String - Name and distance"],
      "within5km": ["String"],
      "within10km": ["String"],
      "within20km": ["String"]
    }
  ],
  "hotels": {
    "budget": [{"name": "String", "rating": "String", "price": "String", "distanceFromAttraction": "String", "bookingLink": "String"}],
    "standard": [{"name": "String", "rating": "String", "price": "String", "distanceFromAttraction": "String", "bookingLink": "String"}],
    "premium": [{"name": "String", "rating": "String", "price": "String", "distanceFromAttraction": "String", "bookingLink": "String"}],
    "luxury": [{"name": "String", "rating": "String", "price": "String", "distanceFromAttraction": "String", "bookingLink": "String"}]
  },
  "restaurants": {
    "breakfast": [{"name": "String", "rating": "String", "cuisine": "String", "price": "String", "distance": "String"}],
    "lunch": [{"name": "String", "rating": "String", "cuisine": "String", "price": "String", "distance": "String"}],
    "dinner": [{"name": "String", "rating": "String", "cuisine": "String", "price": "String", "distance": "String"}],
    "snack": [{"name": "String", "rating": "String", "cuisine": "String", "price": "String", "distance": "String"}]
  },
  "transportation": {
    "taxi": "String - Details and estimate",
    "auto": "String",
    "metro": "String",
    "bus": "String",
    "rentalBike": "String",
    "rentalCar": "String",
    "walkingRoute": "String"
  },
  "costBreakdown": {
    "hotel": "String",
    "food": "String",
    "fuel": "String",
    "transport": "String",
    "tickets": "String",
    "shopping": "String",
    "misc": "String",
    "grandTotal": "String"
  },
  "packingChecklist": {
    "clothing": ["String"],
    "electronics": ["String"],
    "documents": ["String"],
    "health": ["String"],
    "weatherItems": ["String"],
    "photography": ["String"],
    "localEssentials": ["String"]
  },
  "weatherForecast": [
    {
      "dayNumber": 1,
      "temperature": "String",
      "rainChance": "String",
      "humidity": "String",
      "sunrise": "String",
      "sunset": "String"
    }
  ],
  "emergencyInformation": {
    "hospital": "String - Contact/Name",
    "police": "String - Contact",
    "atm": "String - Nearest area",
    "fuelStation": "String - Nearest",
    "pharmacy": "String"
  },
  "localTips": {
    "dressCode": ["String"],
    "templeRules": ["String"],
    "scamAlerts": ["String"],
    "photographyRules": ["String"],
    "localLanguage": ["String"],
    "safetyTips": ["String"]
  }
}"""

        prompt = f"""
SYSTEM ROLE:
{cls.SYSTEM_ROLE_INSTRUCTION}

USER TRIP SPECIFICATIONS:
- Destination: {request.destination} (Country: {request.country or 'N/A'}, State: {request.state or 'N/A'}, City: {request.city or 'N/A'})
- Starting Location: {request.starting_location or 'N/A'}
- Duration: {request.duration_days} Days / {nights} Nights
- Total Allocated Budget: {total_budget_val} (Per Person: {budget_per_person_val}, Currency: {request.currency})
- Travelers: {request.travelers_count} Person(s) ({request.travel_type})
- Travel Style: {request.travel_style}
- Primary Interests: {interests_str}
- Preferred Daily Pace: {request.preferred_pace}
- Preferred Transport: {request.preferred_transport or 'Auto/Taxi/Metro'}
- Preferred Hotel Tier: {request.preferred_hotel_category or '3-4 Star'}
- Special Requirements / Accessibility: {special_reqs}
- Language: {request.preferred_language}

OUTPUT REQUIREMENTS:
Respond ONLY with a valid JSON object matching this EXACT schema structure:
{output_json_schema}
"""
        return prompt.strip()

    @classmethod
    def build_trip_modification_prompt(cls, current_trip_json: Dict[str, Any], modification_instruction: str) -> str:
        """
        Builds a targeted prompt instructing Gemini to apply a natural language modification
        to an existing trip JSON object while preserving unchanged sections.
        """
        trip_str = json.dumps(current_trip_json, indent=2)

        prompt = f"""
SYSTEM ROLE:
{cls.SYSTEM_ROLE_INSTRUCTION}

CURRENT TRIP ITINERARY (JSON):
{trip_str}

USER NATURAL LANGUAGE MODIFICATION INSTRUCTION:
"{modification_instruction}"

CRITICAL INSTRUCTIONS FOR PARTIAL MODIFICATION:
1. Apply the user's specific modification request (e.g. "Remove museums", "Increase budget", "Add 1 extra day", "Replace temples with parks").
2. Regenerate ONLY the affected sections or days. Keep unchanged days and activities intact wherever possible.
3. Update the "budgetBreakdown" totals if activity or hotel costs changed.
4. Maintain proper sequential day numbering ("Day 1", "Day 2", etc.).
5. Do NOT return markdown code blocks (```json), HTML tags, or commentary text. Return pure JSON text adhering strictly to the current trip JSON schema.
"""
        return prompt.strip()
