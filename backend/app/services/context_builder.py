import json
from typing import Dict, Any, List

class ContextBuilder:
    """
    Assembles a complete, multi-dataset Destination Intelligence prompt
    instructing Puter.js / LLM to output a 100% strict NormalizedTrip JSON.
    """

    @classmethod
    def build_prompt_from_raw_context(cls, raw_context: Dict[str, Any], req_data: Dict[str, Any]) -> str:
        destination = raw_context.get("destination", "Destination")
        duration_days = raw_context.get("duration_days", 1)
        budget = raw_context.get("budget_per_person", 5000)
        travelers = req_data.get("travelers_count", 1)
        travel_style = req_data.get("travel_style", "Leisure")
        interests = req_data.get("interests", ["Culture", "Sightseeing"])
        geo = raw_context.get("coordinates", {})
        attractions = raw_context.get("attractions", [])
        hotels = raw_context.get("hotels", {})
        restaurants = raw_context.get("restaurants", {})
        transport = raw_context.get("transport", {})
        weather = raw_context.get("weather", {})
        essentials = raw_context.get("essentials", {})
        clusters = raw_context.get("clusters", {})
        route_meta = raw_context.get("route_meta", {})

        lines: List[str] = [
            "==============================================================================",
            "DESTINATION INTELLIGENCE KNOWLEDGE GRAPH — DO NOT HALLUCINATE OUTSIDE THIS DATA",
            "==============================================================================",
            f"Destination: {destination}",
            f"Coordinates: {geo.get('latitude')}, {geo.get('longitude')} ({geo.get('city')}, {geo.get('state')}, {geo.get('country')})",
            f"Duration: {duration_days} Days / {duration_days - 1} Nights",
            f"Total Travelers: {travelers}",
            f"Budget: ₹{budget:,.0f} per person (Grand Total ₹{budget * travelers:,.0f})",
            f"Travel Style: {travel_style}",
            f"Interests: {', '.join(interests) if isinstance(interests, list) else interests}",
            f"Weather: {weather.get('temperature_celsius')}°C, Wind: {weather.get('windspeed_kmh')} km/h",
            "",
            "--- STEP 1: VERIFIED ATTRACTIONS & CLUSTERS ---"
        ]

        for day_num, day_places in clusters.items():
            lines.append(f"\nDay {day_num} Cluster (Geographically Prohibits Backtracking):")
            for p in day_places:
                lines.append(
                    f"  • Name: {p['name']} | Cat: {p['category']} | Address: {p['address']} | "
                    f"DistPrev: {p.get('distanceFromPrevious')} | TravelTime: {p.get('travelTime')} | "
                    f"Hours: {p.get('openingHours')} - {p.get('closingHours')} | Fee: {p.get('entryFee')} | "
                    f"Duration: {p.get('expectedVisitDuration')} | Rating: {p.get('googleRating')} | "
                    f"Photo: {p.get('bestPhotographyTime')} | Crowd: {p.get('crowdLevel')}"
                )

        lines.append("\n--- STEP 2: VERIFIED HOTELS BY TIER ---")
        lines.append(json.dumps(hotels, indent=2))

        lines.append("\n--- STEP 3: VERIFIED RESTAURANTS BY MEAL ---")
        lines.append(json.dumps(restaurants, indent=2))

        lines.append("\n--- STEP 4: TRANSPORT & LOGISTICS ---")
        lines.append(json.dumps(transport, indent=2))

        lines.append("\n--- STEP 5: ESSENTIAL SERVICES ---")
        lines.append(json.dumps(essentials, indent=2))

        lines.append(
            "\n==============================================================================\n"
            "WANDERAI DESTINATION INTELLIGENCE - STRICT SYSTEM PROMPT\n"
            "==============================================================================\n"
            "ROLE: You are an expert Travel Planner AI for WanderAI. You are NOT a search engine or a database. "
            "You are NOT allowed to guess. Your ONLY job is to organize the REAL destination data provided above "
            "into a production-quality, premium itinerary.\n\n"
            "CRITICAL NO-HALLUCINATION POLICY:\n"
            "- You MUST NEVER INVENT places, tourist attractions, hotels, restaurants, markets, museums, airports, "
            "railway stations, metros, bus stations, waterfalls, beaches, sunset points, viewpoints, adventure "
            "activities, shopping areas, food streets, UNESCO sites, or temples.\n"
            "- If a place is NOT explicitly provided in the backend data above, you MUST NOT generate it.\n"
            "- NEVER create names by combining the destination name with generic words (e.g., do NOT generate "
            "'Destination Botanical Park' or 'Destination Regional Airport').\n"
            "- If an Airport/Metro/Ropeway does not exist in the transport data, do NOT show it.\n"
            "- If the provided verified attractions are insufficient, DO NOT invent attractions. Instead, return: "
            '{\n "status":"INSUFFICIENT_DATA",\n "message":"Not enough verified attractions were supplied by the backend to create a complete itinerary."\n}\n\n'
            "DAY PLANNING RULES:\n"
            "- Optimize geographically. Day 1: Main destination. Day 2: 0-25 km. Day 3: 25-60 km. Day 4: 60-120 km. Day 5: Shopping & Return.\n"
            "- Nearby places MUST stay together in the same day's itinerary to minimize travel time.\n"
            "- NEVER zig-zag or waste driving time.\n"
            "- Every attraction can appear ONLY ONCE. Do NOT duplicate attractions, hotels, restaurants, or shopping areas.\n\n"
            "TRIP QUALITY:\n"
            "- The itinerary MUST look like a premium itinerary created manually by a human travel expert (comparable to TripAdvisor, Wanderlog, MakeMyTrip).\n"
            "- Each day should logically flow: Morning (Breakfast, Attraction, Travel Time, Ticket, Why Visit) -> Afternoon (Lunch, Nearby Attraction, Tea Break) -> Evening (Sunset, Dinner, Hotel).\n\n"
            "OUTPUT FORMAT:\n"
            "- Return STRICT VALID JSON ONLY.\n"
            "- No markdown formatting, no code blocks, no explanation, no conversational text, no greetings.\n"
            "- Validate JSON syntax before returning (No trailing commas, no duplicate keys, no null/undefined values, no placeholder text).\n"
            "==============================================================================\n"
            "REQUIRED EXACT JSON SCHEMA:\n"
            "{\n"
            '  "destinationOverview": {\n'
            '    "destination": "' + destination + '",\n'
            '    "bestTime": "October to March",\n'
            '    "currentWeather": "' + str(weather.get("temperature_celsius", 26)) + '°C, Sunny",\n'
            '    "temperature": "' + str(weather.get("temperature_celsius", 26)) + '°C",\n'
            '    "currency": "INR (₹)",\n'
            '    "language": "Hindi / English / Local",\n'
            '    "famousFor": "Heritage, Nature & Culture",\n'
            '    "mapCoordinates": "' + str(geo.get("latitude")) + ', ' + str(geo.get("longitude")) + '"\n'
            '  },\n'
            '  "tripHighlights": {\n'
            '    "top10Attractions": ["Exact Verified Name 1", "Exact Verified Name 2"],\n'
            '    "hiddenGems": ["gem1"],\n'
            '    "unescoSites": ["unesco1"],\n'
            '    "localFestivals": ["festival1"],\n'
            '    "famousFood": ["thali", "street food"],\n'
            '    "bestSunset": ["sunset point"],\n'
            '    "bestSunrise": ["sunrise point"],\n'
            '    "shopping": ["market"],\n'
            '    "adventure": ["trek"],\n'
            '    "photographySpots": ["spot1"]\n'
            '  },\n'
            '  "routeOptimization": ' + json.dumps(route_meta) + ',\n'
            '  "dailyItinerary": [\n'
            '    {\n'
            '      "dayNumber": 1,\n'
            '      "title": "Day 1 Title",\n'
            '      "activities": [\n'
            '        {\n'
            '          "placeName": "Exact Verified Attraction Name",\n'
            '          "address": "Verified Full Address",\n'
            '          "distance": "1.2 km",\n'
            '          "travelTime": "15 mins",\n'
            '          "rating": "4.8",\n'
            '          "openingHours": "08:00 AM",\n'
            '          "entryFee": "Free",\n'
            '          "bestTime": "Morning",\n'
            '          "expectedDuration": "1.5 Hours",\n'
            '          "coordinates": "22.4,73.5",\n'
            '          "category": "Sightseeing",\n'
            '          "description": "Engaging description"\n'
            '        }\n'
            '      ]\n'
            '    }\n'
            '  ],\n'
            '  "hotels": ' + json.dumps(hotels) + ',\n'
            '  "restaurants": ' + json.dumps(restaurants) + ',\n'
            '  "shopping": [],\n'
            '  "transportation": ' + json.dumps(transport) + ',\n'
            '  "weather": [\n'
            '    { "dayNumber": 1, "temperature": "' + str(weather.get("temperature_celsius", 26)) + '°C", "rainChance": "10%", "humidity": "50%", "sunrise": "06:15 AM", "sunset": "06:45 PM" }\n'
            '  ],\n'
            '  "packingChecklist": {\n'
            '    "clothing": ["Light cottons", "Comfortable walking shoes"],\n'
            '    "electronics": ["Power bank", "Camera"],\n'
            '    "documents": ["ID Proof", "Booking vouchers"],\n'
            '    "health": ["Medications", "Sunscreen"],\n'
            '    "weatherItems": ["Cap / Hat"],\n'
            '    "photography": ["Extra SD card"],\n'
            '    "localEssentials": ["Water bottle"]\n'
            '  },\n'
            '  "travelTips": {\n'
            '    "dressCode": ["Modest clothing for temples"],\n'
            '    "templeRules": ["Remove footwear at entrance"],\n'
            '    "scamAlerts": ["Avoid unofficial touts"],\n'
            '    "photographyRules": ["Check rules inside sanctums"],\n'
            '    "localLanguage": ["Namaste"],\n'
            '    "safetyTips": ["Keep emergency contacts saved"]\n'
            '  },\n'
            '  "emergencyContacts": ' + json.dumps(essentials) + ',\n'
            '  "costBreakdown": {\n'
            '    "hotel": "₹' + f"{int(budget * travelers * 0.40):,}" + '",\n'
            '    "food": "₹' + f"{int(budget * travelers * 0.25):,}" + '",\n'
            '    "fuel": "₹' + f"{int(budget * travelers * 0.10):,}" + '",\n'
            '    "transport": "₹' + f"{int(budget * travelers * 0.10):,}" + '",\n'
            '    "tickets": "₹' + f"{int(budget * travelers * 0.08):,}" + '",\n'
            '    "shopping": "₹' + f"{int(budget * travelers * 0.05):,}" + '",\n'
            '    "misc": "₹' + f"{int(budget * travelers * 0.02):,}" + '",\n'
            '    "grandTotal": "₹' + f"{int(budget * travelers):,}" + '"\n'
            '  }\n'
            "}\n"
            "=============================================================================="
        )

        return "\n".join(lines)
