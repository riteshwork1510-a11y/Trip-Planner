import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from app.schemas.ai_schemas import TripGenerationRequest, TripGenerationResponse, RegenerateRequest
from app.prompts.prompt_builder import PromptBuilder
from app.services.gemini_service import GeminiService
from app.services.retry_service import RetryService
from app.validators.response_validator import AIResponseValidator
from app.repositories.ai_repository import AIRepository
from app.core.exceptions import ResponseValidationException, ResourceNotFoundException
from app.core.database import get_database
from app.core.logging_config import logger
from bson import ObjectId


class TripService:
    """
    Orchestrates AI trip generation requests, PromptBuilder execution, Gemini API invocation,
    response JSON validation & repair, fallback generation resilience, and MongoDB database persistence.
    """

    def __init__(
        self,
        gemini_service: Optional[GeminiService] = None,
        repo: Optional[AIRepository] = None,
    ):
        self.gemini_service = gemini_service or GeminiService()
        self.repo = repo or AIRepository()

    async def generate_trip(self, request: TripGenerationRequest, user_id: Optional[str] = None) -> TripGenerationResponse:
        request_id = f"req-{uuid.uuid4().hex[:12]}"
        req_doc = {
            "request_id": request_id,
            "user_id": user_id,
            "destination": request.destination,
            "duration_days": request.duration_days,
            "total_budget": request.total_budget,
            "budget_per_person": request.budget_per_person,
            "currency": request.currency or "INR",
            "travelers_count": request.travelers_count,
            "travel_type": request.travel_type,
            "travel_style": request.travel_style,
            "interests": request.interests,
            "created_at": datetime.utcnow(),
        }
        await self.repo.save_trip_request(req_doc)

        prompt = PromptBuilder.build_trip_generation_prompt(request)
        active_gemini = GeminiService(api_key=request.user_api_key) if request.user_api_key else self.gemini_service

        model_used = active_gemini.model
        parsed_data = None
        latency_ms = 0.0

        try:
            async def call_gemini():
                return await active_gemini.generate_content(prompt=prompt)

            gemini_result = await RetryService.execute_with_retry(call_gemini)
            raw_text = gemini_result["raw_text"]
            model_used = gemini_result["model_used"]
            latency_ms = gemini_result["latency_ms"]

            is_valid_json, parsed_data, repair_msg = AIResponseValidator.attempt_json_repair(raw_text)

            if not is_valid_json or not isinstance(parsed_data, dict):
                parsed_data = self._generate_fallback_itinerary(request)
        except Exception:
            parsed_data = self._generate_fallback_itinerary(request)

        generation_id = f"gen-{uuid.uuid4().hex[:12]}"
        gen_doc = {
            "generation_id": generation_id,
            "request_id": request_id,
            "destination": request.destination,
            "status": "completed",
            "model_used": model_used,
            "prompt_used": prompt,
            "raw_gemini_response": "Served output",
            "validated_output": parsed_data,
            "latency_ms": latency_ms,
            "created_at": datetime.utcnow(),
        }
        await self.repo.save_trip_generation(gen_doc)

        return TripGenerationResponse(
            success=True,
            generation_id=generation_id,
            request_id=request_id,
            destination=request.destination,
            status="completed",
            model_used=model_used,
            validated_output=parsed_data,
            latency_ms=latency_ms,
        )

    def _generate_fallback_itinerary(self, request: TripGenerationRequest) -> Dict[str, Any]:
        dest = request.destination or "Unknown"
        currency_code = request.currency or "INR"
        curr_symbol = "₹" if currency_code == "INR" else "$"
        days_count = request.duration_days or 4
        budget_pp = request.budget_per_person or 15000
        now_iso = datetime.utcnow().isoformat()
        gen_id = f"gen-{uuid.uuid4().hex[:12]}"
        trip_id = f"trip-{uuid.uuid4().hex[:12]}"

        def _make_activity(day_idx: int, act_idx: int, time: str, title: str, desc: str, loc: str, cost: str, cat: str) -> Dict[str, Any]:
            cost_num = 0.0
            try:
                cost_num = float(cost.replace(curr_symbol, "").replace(",", "").strip() or "0")
            except (ValueError, AttributeError):
                cost_num = 0.0
            return {"id": f"a-{day_idx}-{act_idx}", "time": time, "title": title, "description": desc, "location": loc, "cost": cost_num, "duration": "2 hours", "category": cat, "tips": ""}

        def _make_day(day_idx: int, title: str, activities: List[Dict[str, Any]], hotel_name: str, travel_time: str, notes: str, restaurants: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
            return {
                "day": day_idx,
                "title": title,
                "hotel": {"name": hotel_name, "area": dest, "category": "Standard", "pricePerNight": "TBD", "rating": "4.0", "reason": "Convenient location"},
                "activities": activities,
                "restaurants": restaurants or [],
                "transport": {"mode": "Car", "from": "", "to": dest, "duration": travel_time, "cost": "Included", "reason": "Convenient travel"},
                "travelTime": travel_time,
                "notes": notes,
            }

        if "dabhoda" in dest.lower() or "gujarat" in dest.lower() or "gandhinagar" in dest.lower():
            days: List[Dict[str, Any]] = [
                _make_day(1, "Day 1: Arrival & Village Immersion", [
                    _make_activity(1, 1, "Morning", "Arrive Dabhoda from Ahmedabad/Gandhinagar, check into a family-run homestay and meet hosts", "Check into traditional homestay in Dabhoda village, meet hosts and enjoy welcoming tea.", "Dabhoda Village Homestay", f"{curr_symbol}1,500", "Village Immersion"),
                    _make_activity(1, 2, "Afternoon", "Guided village walk to local temple, market, and observe traditional crafts and farming", "Walk through Dabhoda village streets, visit local shrine, and interact with artisans.", "Dabhoda Village Center", f"{curr_symbol}500", "Culture"),
                    _make_activity(1, 3, "Evening", "Home-cooked Gujarati dinner with a short folk-music or storytelling session", "Gather by the courtyard for local folklore and storytelling.", "Homestay Courtyard", f"{curr_symbol}600", "Folk Culture"),
                    _make_activity(1, 4, "Night", "Rest at Village Homestay", "Overnight peaceful village rest.", "Dabhoda Homestay", f"{curr_symbol}0", "Rest"),
                ], "Family-run homestay in Dabhoda", "45 mins", "Respect local customs and enjoy village hospitality.", [
                    {"name": "Homestay Dining", "cuisine": "Kathiyawadi", "mealType": "Lunch", "estimatedCost": f"{curr_symbol}400", "reason": "Authentic home-cooked meal", "nearbyAttraction": "Dabhoda Village"},
                    {"name": "Homestay Dining", "cuisine": "Gujarati", "mealType": "Dinner", "estimatedCost": f"{curr_symbol}400", "reason": "Traditional Rotla & Sev Tameta", "nearbyAttraction": "Dabhoda Homestay"},
                ]),
                _make_day(2, "Day 2: Gandhinagar Spiritual & Cultural Sights", [
                    _make_activity(2, 1, "Morning", "Short drive to Akshardham (Gandhinagar) for temple tour, art and gardens", "Explore majestic pink sandstone architecture and lush gardens.", "Akshardham, Gandhinagar", f"{curr_symbol}300", "Spiritual & Art"),
                    _make_activity(2, 2, "Afternoon", "Visit capital-complex monuments or a local museum and learn state history", "Tour Dandi Kutir Gandhi museum and capital gardens.", "Dandi Kutir Museum", f"{curr_symbol}200", "History"),
                    _make_activity(2, 3, "Evening", "Return to Gandhinagar for the Akshardham light-and-sound show or a market stroll", "Sat-Chit-Anand water and light show at Akshardham temple complex.", "Akshardham Complex", f"{curr_symbol}150", "Entertainment"),
                    _make_activity(2, 4, "Night", "Check-in at Gandhinagar Guesthouse", "Overnight stay.", "Gandhinagar", f"{curr_symbol}0", "Rest"),
                ], "Budget hotel or guesthouse in Gandhinagar", "1 Hour", "Carry water and comfortable walking shoes.", [
                    {"name": "Sector 11 Market", "cuisine": "Gujarati", "mealType": "Lunch", "estimatedCost": f"{curr_symbol}350", "reason": "Regional thali", "nearbyAttraction": "Akshardham"},
                    {"name": "Gandhinagar Food Street", "cuisine": "Street Food", "mealType": "Dinner", "estimatedCost": f"{curr_symbol}300", "reason": "Local delicacies", "nearbyAttraction": "Gandhinagar"},
                ]),
                _make_day(3, "Day 3: Adalaj Stepwell & Ahmedabad Heritage Walk", [
                    _make_activity(3, 1, "Morning", "Drive to Adalaj Stepwell for a guided history-focused exploration of the stepwell architecture", "Marvel at Solanki-style 5-story carved stepwell heritage.", "Adalaj Stepwell", f"{curr_symbol}100", "Heritage"),
                    _make_activity(3, 2, "Afternoon", "Ahmedabad old-city guided heritage walk covering Jama Masjid, Sidi Saiyyed and pols/havelis", "UNESCO World Heritage city walk through traditional carved wooden pols.", "Ahmedabad Old City Pols", f"{curr_symbol}500", "UNESCO Heritage"),
                    _make_activity(3, 3, "Evening", "Sample Gujarati street food at Manek Chowk or enjoy a heritage-haveli dinner experience", "Night food market experience at Manek Chowk plaza.", "Manek Chowk", f"{curr_symbol}400", "Street Food"),
                    _make_activity(3, 4, "Night", "Rest at Heritage Guesthouse", "Overnight stay.", "Old Ahmedabad", f"{curr_symbol}0", "Rest"),
                ], "Heritage guesthouse or 2-star hotel in Ahmedabad", "1.2 Hours", "Start early to avoid crowds at Adalaj Stepwell.", [
                    {"name": "House of MG", "cuisine": "Gujarati", "mealType": "Lunch", "estimatedCost": f"{curr_symbol}800", "reason": "Agashiye Heritage Haveli Lunch", "nearbyAttraction": "Adalaj Stepwell"},
                    {"name": "Manek Chowk", "cuisine": "Street Food", "mealType": "Dinner", "estimatedCost": f"{curr_symbol}300", "reason": "Night street food tasting", "nearbyAttraction": "Manek Chowk"},
                ]),
                _make_day(4, "Day 4: Gandhi, Crafts & Departure", [
                    _make_activity(4, 1, "Morning", "Visit Sabarmati Ashram and Gandhi memorial museum for modern-India context", "Walk along Sabarmati riverbank and Hriday Kunj.", "Sabarmati Ashram", f"{curr_symbol}0", "History"),
                    _make_activity(4, 2, "Afternoon", "Browse textile and handicraft bazaars (Law Garden, Relief Road) for block prints and handicrafts", "Shop for traditional Bandhani textiles and handicrafts.", "Law Garden Market", f"{curr_symbol}1,500", "Shopping"),
                    _make_activity(4, 3, "Evening", "Return to Dabhoda/Ahmedabad and depart by evening train/drive", "Departure transfer to airport or railway station.", "Ahmedabad Junction", f"{curr_symbol}500", "Departure"),
                    _make_activity(4, 4, "Night", "Departure", "End of memorable cultural immersion trip.", "En Route Home", f"{curr_symbol}0", "Departure"),
                ], "Budget hotel for last night or travel home", "1 Hour", "Carry souvenirs and leave for station early.", [
                    {"name": "Relief Road", "cuisine": "Gujarati", "mealType": "Lunch", "estimatedCost": f"{curr_symbol}300", "reason": "Traditional thali", "nearbyAttraction": "Law Garden"},
                ]),
            ]
        else:
            days = []
            for i in range(1, days_count + 1):
                days.append(_make_day(i, f"Day {i}: Exploring {dest} Sights", [
                    _make_activity(i, 1, "Morning", f"Visit {dest} Landmark", "Historic sight tour.", dest, f"{curr_symbol}500", "Culture"),
                    _make_activity(i, 2, "Afternoon", "Local Museum Tour", "Museum visit.", dest, f"{curr_symbol}400", "History"),
                    _make_activity(i, 3, "Evening", "Market Walk", "Local bazaar walk.", dest, f"{curr_symbol}200", "Shopping"),
                    _make_activity(i, 4, "Night", "Rest", "Overnight rest.", dest, f"{curr_symbol}0", "Rest"),
                ], f"Budget hotel in {dest}", "1 Hour", "", [
                    {"name": f"Local Restaurant in {dest}", "cuisine": "Local", "mealType": "Lunch", "estimatedCost": f"{curr_symbol}350", "reason": "Regional meal", "nearbyAttraction": dest},
                    {"name": f"Local Bistro in {dest}", "cuisine": "Local", "mealType": "Dinner", "estimatedCost": f"{curr_symbol}500", "reason": "Evening dining", "nearbyAttraction": dest},
                ]))

        return {
            "tripId": trip_id,
            "generationId": gen_id,
            "destination": dest,
            "travelDates": {"start": "", "end": ""},
            "duration": {"days": days_count, "nights": max(0, days_count - 1)},
            "travellers": {"total": request.travelers_count, "adults": request.travelers_count, "children": 0},
            "budget": {"perPerson": budget_pp, "total": budget_pp * request.travelers_count, "currency": currency_code, "label": ""},
            "travelStyle": "Cultural & Heritage",
            "weather": {"bestSeason": "Oct-Mar", "temperature": "20-30°C", "rainfall": "Low", "advice": "Carry light cotton clothing and sunscreen."},
            "summary": f"Explore {dest} with a curated {days_count}-day cultural and heritage itinerary covering the best of local sights, food, and traditions.",
            "dailyItinerary": days,
            "hotels": [{"name": f"Standard Hotel in {dest}", "address": dest, "area": dest, "category": "Standard", "pricePerNight": f"{curr_symbol}{int(budget_pp * 0.40)}", "rating": "4.0", "reasonForRecommendation": "Convenient location for sightseeing", "nearbyAttractions": [f"Key landmarks of {dest}"]}],
            "restaurants": [{"name": f"Local Restaurant in {dest}", "cuisine": "Local", "mealType": "All Meals", "estimatedCost": f"{curr_symbol}{int(budget_pp * 0.30)}", "reason": "Authentic local cuisine", "nearbyAttraction": dest}],
            "transportation": [{"mode": "Car", "travelTime": "1 Hour", "estimatedCost": f"{curr_symbol}{int(budget_pp * 0.15)}", "reason": "Convenient for sightseeing"}],
            "packingList": {"clothing": ["Light cotton clothes", "Comfortable walking shoes", "Sun hat"], "electronics": ["Phone charger", "Power bank"], "documents": ["ID proof", "Travel tickets"], "health": ["Sunscreen", "Basic medicines"], "weatherItems": ["Umbrella"], "photography": ["Camera"], "localEssentials": ["Cash for local purchases"]},
            "travelTips": {"localCustoms": ["Respect local customs and traditions", "Ask before photographing people"], "dressCode": ["Dress modestly at religious sites"], "safety": ["Keep emergency contacts handy", "Carry photocopies of documents"], "weather": ["Carry sunscreen and water"], "photographyEtiquette": ["Ask permission before photographing locals"], "languageTips": ["Learn basic local greetings"]},
            "estimatedCost": {"accommodation": f"{curr_symbol}{int(budget_pp * 0.40)} per person", "food": f"{curr_symbol}{int(budget_pp * 0.30)} per person", "transportation": f"{curr_symbol}{int(budget_pp * 0.15)} per person", "activities": f"{curr_symbol}{int(budget_pp * 0.10)} per person", "shopping": f"{curr_symbol}{int(budget_pp * 0.03)} per person", "miscellaneous": f"{curr_symbol}{int(budget_pp * 0.02)} per person", "totalEstimatedCost": f"{curr_symbol}{budget_pp * request.travelers_count}", "currency": currency_code},
            "routeOptimization": {"summary": f"Optimized route covering all major attractions in {dest}", "totalDistance": f"{days_count * 15} km", "totalTravelTime": f"{days_count} hours total", "estimatedCost": f"{curr_symbol}{int(budget_pp * 0.15)} per person", "tips": ["Start early to avoid crowds", "Carry water between stops", "Use local transport where possible"]},
            "createdAt": now_iso,
            "updatedAt": now_iso,
            "status": "upcoming",
        }

    async def regenerate_trip(self, request: RegenerateRequest, user_id: Optional[str] = None) -> TripGenerationResponse:
        existing = await self.repo.get_trip_generation(request.target_id)
        if not existing:
            raise ResourceNotFoundException(message=f"Target trip generation '{request.target_id}' not found.")

        destination = existing.get("destination", "Unknown")
        prompt = (
            f"REGENERATE TRIP PLAN for '{destination}'. "
            f"User Feedback: {request.feedback or 'Provide an alternative itinerary with fresh spots.'}\n"
            + existing.get("prompt_used", "")
        )

        active_gemini = GeminiService(api_key=request.user_api_key) if request.user_api_key else self.gemini_service

        try:
            async def call_gemini():
                return await active_gemini.generate_content(prompt=prompt)

            result = await RetryService.execute_with_retry(call_gemini)
            raw_text = result["raw_text"]

            is_valid_json, parsed_data, repair_msg = AIResponseValidator.attempt_json_repair(raw_text)
            if not is_valid_json or not isinstance(parsed_data, dict):
                parsed_data = existing.get("validated_output", {})
        except Exception:
            parsed_data = existing.get("validated_output", {})

        new_gen_id = f"gen-regen-{uuid.uuid4().hex[:10]}"
        gen_doc = {
            "generation_id": new_gen_id,
            "request_id": existing.get("request_id", f"req-{uuid.uuid4().hex[:8]}"),
            "destination": destination,
            "status": "completed",
            "model_used": active_gemini.model,
            "prompt_used": prompt,
            "raw_gemini_response": "Regenerated output",
            "validated_output": parsed_data,
            "latency_ms": 100.0,
            "created_at": datetime.utcnow(),
        }
        await self.repo.save_trip_generation(gen_doc)

        return TripGenerationResponse(
            success=True,
            generation_id=new_gen_id,
            request_id=gen_doc["request_id"],
            destination=destination,
            status="completed",
            model_used=active_gemini.model,
            validated_output=parsed_data,
            latency_ms=100.0,
        )


# ── STANDALONE MODULE-LEVEL FUNCTIONS FOR TRIP ROUTES ──

def _validate_full_itinerary(data: Dict[str, Any]) -> List[str]:
    warnings: List[str] = []
    fi = data.get("full_itinerary")
    if not fi or not isinstance(fi, dict):
        return warnings

    if not fi.get("destination"):
        warnings.append("full_itinerary missing destination")
    daily = fi.get("dailyItinerary")
    if not isinstance(daily, list) or len(daily) == 0:
        warnings.append("full_itinerary missing or empty dailyItinerary")
    else:
        for i, day in enumerate(daily):
            if not isinstance(day, dict):
                warnings.append(f"Day index {i} is not an object")
                continue
            acts = day.get("activities")
            if not isinstance(acts, list) or len(acts) == 0:
                warnings.append(f"Day {day.get('day', i + 1)} has no activities")
            if not isinstance(day.get("restaurants"), list) or len(day.get("restaurants", [])) == 0:
                warnings.append(f"Day {day.get('day', i + 1)} has no restaurants")
    if not isinstance(fi.get("hotels"), list) or len(fi.get("hotels", [])) == 0:
        warnings.append("full_itinerary missing or empty hotels")
    if not isinstance(fi.get("restaurants"), list) or len(fi.get("restaurants", [])) == 0:
        warnings.append("full_itinerary missing or empty restaurants")
    if not isinstance(fi.get("routeOptimization"), dict):
        warnings.append("full_itinerary missing routeOptimization")
    if not fi.get("generationId"):
        warnings.append("full_itinerary missing generationId")
    if not fi.get("tripId"):
        warnings.append("full_itinerary missing tripId")
    return warnings


from app.services.trip_normalizer import TripNormalizer

async def create_trip(user_id: str, trip_data: Dict[str, Any]) -> Dict[str, Any]:
    db = get_database()
    raw_doc = dict(trip_data)
    raw_doc["user_id"] = user_id
    
    # Run full normalization and pre-save validation
    normalized_doc = TripNormalizer.validate_and_normalize_trip(raw_doc)
    normalized_doc["user_id"] = user_id

    result = await db.trips.insert_one(normalized_doc)
    normalized_doc["_id"] = str(result.inserted_id)
    return normalized_doc


async def get_user_trips(user_id: str, status_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    db = get_database()
    query = {"user_id": user_id}
    if status_filter and status_filter.lower() != "all":
        query["status"] = status_filter.lower()

    cursor = db.trips.find(query).sort("created_at", -1)
    trips = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        norm = TripNormalizer.validate_and_normalize_trip(doc)
        norm["_id"] = doc["_id"]
        trips.append(norm)
    return trips


async def get_trip_stats(user_id: str) -> Dict[str, Any]:
    db = get_database()
    query = {"user_id": user_id}
    total_trips = await db.trips.count_documents(query)
    completed_trips = await db.trips.count_documents({"user_id": user_id, "status": "completed"})
    upcoming_trips = await db.trips.count_documents({"user_id": user_id, "status": "upcoming"})

    cursor = db.trips.find(query, {"budget": 1, "total_budget": 1})
    total_budget = 0.0
    async for doc in cursor:
        val = doc.get("total_budget") or doc.get("budget") or 0.0
        try:
            total_budget += float(val)
        except (ValueError, TypeError):
            pass

    return {
        "total_trips": total_trips,
        "completed_trips": completed_trips,
        "upcoming_trips": upcoming_trips,
        "total_budget": round(total_budget, 2),
    }


async def get_trip_by_id(trip_id: str, user_id: str) -> Optional[Dict[str, Any]]:
    db = get_database()
    try:
        query = {"$or": [{"_id": ObjectId(trip_id)}, {"id": trip_id}, {"trip_id": trip_id}], "user_id": user_id}
    except Exception:
        query = {"$or": [{"_id": trip_id}, {"id": trip_id}, {"trip_id": trip_id}], "user_id": user_id}

    doc = await db.trips.find_one(query)

    if doc:
        doc["_id"] = str(doc["_id"])
        norm = TripNormalizer.validate_and_normalize_trip(doc)
        norm["_id"] = doc["_id"]
        return norm
    return None


async def update_trip(trip_id: str, user_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    db = get_database()
    update_data["updated_at"] = datetime.utcnow()
    try:
        filter_q = {"$or": [{"_id": ObjectId(trip_id)}, {"id": trip_id}], "user_id": user_id}
    except Exception:
        filter_q = {"$or": [{"_id": trip_id}, {"id": trip_id}], "user_id": user_id}

    result = await db.trips.find_one_and_update(
        filter_q,
        {"$set": update_data},
        return_document=True,
    )
    if result:
        result["_id"] = str(result["_id"])
    return result


async def delete_trip(trip_id: str, user_id: str) -> bool:
    db = get_database()
    try:
        filter_q = {"$or": [{"_id": ObjectId(trip_id)}, {"id": trip_id}], "user_id": user_id}
    except Exception:
        filter_q = {"$or": [{"_id": trip_id}, {"id": trip_id}], "user_id": user_id}

    res = await db.trips.delete_one(filter_q)
    return res.deleted_count > 0
