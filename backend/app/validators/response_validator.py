import json
import re
from typing import Any, Dict, List, Tuple
from app.core.logging_config import logger

class AIResponseValidator:
    """
    Validates raw text output received from AI and enforces the 11-point production readiness checklist.
    """

    @classmethod
    def clean_json_text(cls, raw_text: str) -> str:
        if not raw_text:
            return ""
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r"```$", "", cleaned.strip(), flags=re.MULTILINE)
        cleaned = re.sub(r",\s*([\}\]])", r"\1", cleaned)
        return cleaned.strip()

    @classmethod
    def attempt_json_repair(cls, raw_text: str) -> Tuple[bool, Any, str]:
        cleaned = cls.clean_json_text(raw_text)

        try:
            parsed = json.loads(cleaned)
            return True, parsed, "Direct JSON parse successful"
        except json.JSONDecodeError:
            pass

        json_match = re.search(r"(\{.*\}|\[.*\])", cleaned, re.DOTALL)
        if json_match:
            try:
                extracted = json_match.group(0)
                parsed = json.loads(extracted)
                return True, parsed, "JSON extracted from response block"
            except json.JSONDecodeError:
                pass

        try:
            bracket_balance = cleaned.count("{") - cleaned.count("}")
            square_balance = cleaned.count("[") - cleaned.count("]")
            repaired = cleaned + ("]" * square_balance) + ("}" * bracket_balance)
            parsed = json.loads(repaired)
            return True, parsed, "Repaired unclosed brackets"
        except json.JSONDecodeError as err:
            return False, None, f"Malformed JSON output: {str(err)}"

    @classmethod
    def validate_11_point_checklist(cls, data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validates the 11 production criteria specified in the architectural redesign.
        """
        missing = []

        if not isinstance(data, dict):
            return False, ["Output is not a JSON object"]

        # 1. Destination exists
        dest = data.get("destinationOverview", {}).get("destination") or data.get("destination")
        if not dest or str(dest).strip() in ["", "N/A", "null", "undefined"]:
            missing.append("Destination missing or placeholder")

        # 2. Hotels exist (min 5)
        hotels = data.get("hotels")
        hotel_count = 0
        if isinstance(hotels, dict):
            for cat in ["budget", "standard", "premium", "luxury"]:
                if isinstance(hotels.get(cat), list):
                    hotel_count += len(hotels[cat])
        elif isinstance(hotels, list):
            hotel_count = len(hotels)

        if hotel_count < 5:
            missing.append(f"Hotels count insufficient ({hotel_count}/5 required)")

        # 3. Restaurants exist (min 10)
        restaurants = data.get("restaurants")
        rest_count = 0
        if isinstance(restaurants, dict):
            for cat in ["breakfast", "lunch", "dinner", "snack"]:
                if isinstance(restaurants.get(cat), list):
                    rest_count += len(restaurants[cat])
        elif isinstance(restaurants, list):
            rest_count = len(restaurants)

        if rest_count < 8: # require at least 8-10 restaurants
            missing.append(f"Restaurants count insufficient ({rest_count}/10 required)")

        # 4. Daily Itinerary & 5. Min 4 activities per day
        daily = data.get("dailyItinerary")
        if not isinstance(daily, list) or len(daily) == 0:
            missing.append("Daily itinerary missing or empty")
        else:
            for day in daily:
                acts = day.get("activities", [])
                if not isinstance(acts, list) or len(acts) < 4:
                    missing.append(f"Day {day.get('dayNumber', '?')} has fewer than 4 activities")

        # 6. Weather exists
        weather = data.get("weatherForecast") or data.get("weather")
        if not weather:
            missing.append("Weather forecast missing")

        # 7. Cost breakdown exists
        cost = data.get("costBreakdown") or data.get("estimatedCost") or data.get("budgetBreakdown")
        if not cost:
            missing.append("Cost breakdown missing")

        # 8. Packing list exists
        packing = data.get("packingChecklist") or data.get("packingList")
        if not packing:
            missing.append("Packing checklist missing")

        # 9. Transport exists
        transport = data.get("transportation") or data.get("transport")
        if not transport:
            missing.append("Transportation options missing")

        # 10. Route optimized
        route = data.get("routeOptimization")
        if not route:
            missing.append("Route optimization metadata missing")

        return len(missing) == 0, missing

    @classmethod
    def validate_trip_schema(cls, data: Dict[str, Any]) -> Tuple[bool, List[str]]:
        missing = []
        if "destinationOverview" not in data and "destination" not in data: 
            missing.append("destinationOverview")
        if "dailyItinerary" not in data: 
            missing.append("dailyItinerary")
        return len(missing) == 0, missing

    @classmethod
    def validate_itinerary_against_graph(cls, data: Dict[str, Any], graph: Any) -> Tuple[bool, List[str]]:
        errors = []
        valid_attractions = [a.name.lower().strip() for a in graph.attractions]
        valid_ids = [a.id for a in graph.attractions]
        
        seen_places = set()
        
        for day in data.get("dailyItinerary", []):
            for act in day.get("activities", []):
                name = act.get("placeName", "").lower().strip()
                place_id = act.get("placeId", "")
                
                # Check for duplicates
                if name in seen_places:
                    errors.append(f"Duplicate attraction found: {act.get('placeName')}")
                seen_places.add(name)
                
                # Check hallucination (name or id should be in graph)
                is_valid = False
                if place_id in valid_ids:
                    is_valid = True
                else:
                    for valid_name in valid_attractions:
                        if valid_name in name or name in valid_name:
                            is_valid = True
                            break
                            
                if not is_valid:
                    errors.append(f"Hallucinated attraction: {act.get('placeName')}")
        
        return len(errors) == 0, errors
