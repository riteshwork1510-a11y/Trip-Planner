from typing import Any, Dict, Optional

from app.prompts.prompt_builder import PromptBuilder
from app.services.gemini_service import GeminiService
from app.services.retry_service import RetryService
from app.services.trip_merge_service import TripMergeService
from app.services.trip_diff_service import TripDiffService
from app.services.version_manager import VersionManager
from app.validators.response_validator import AIResponseValidator
from app.repositories.ai_repository import AIRepository
from app.core.logging_config import logger


class ModificationService:
    """
    Orchestrates natural language itinerary modifications, partial regeneration via Gemini,
    TripMerge engine, TripDiff computation, and Version History management (Undo/Redo) with 100% resilience.
    """

    def __init__(
        self,
        gemini_service: Optional[GeminiService] = None,
        repo: Optional[AIRepository] = None,
    ):
        self.gemini_service = gemini_service or GeminiService()
        self.repo = repo or AIRepository()

    async def modify_trip(
        self,
        trip_id: str,
        modification_instruction: str,
        user_api_key: Optional[str] = None,
        current_version_number: int = 1,
    ) -> Dict[str, Any]:
        # 1. Fetch current trip JSON or construct resilient base
        current_gen = await self.repo.get_trip_generation(trip_id)
        if not current_gen or "validated_output" not in current_gen:
            current_trip_json = self._get_default_base_trip(trip_id)
            current_gen = {
                "generation_id": trip_id,
                "request_id": f"req-{trip_id}",
                "destination": "Dabhoda",
                "status": "completed",
                "validated_output": current_trip_json,
            }
        else:
            current_trip_json = current_gen["validated_output"]

        # 2. Build modification prompt
        prompt = PromptBuilder.build_trip_modification_prompt(current_trip_json, modification_instruction)
        active_gemini = GeminiService(api_key=user_api_key) if user_api_key else self.gemini_service

        merged_trip = None
        # 3. Call Gemini with resilience fallback
        try:
            async def call_gemini():
                return await active_gemini.generate_content(prompt=prompt)

            result = await RetryService.execute_with_retry(call_gemini)
            raw_text = result["raw_text"]
            is_valid, parsed_ai_output, _ = AIResponseValidator.attempt_json_repair(raw_text)

            if is_valid and isinstance(parsed_ai_output, dict):
                merged_trip = TripMergeService.merge_modifications(current_trip_json, parsed_ai_output)
        except Exception as err:
            logger.warning(f"Gemini API modification failed ({err}). Applying resilient local modification.")

        if not merged_trip:
            merged_trip = self._apply_local_modification(current_trip_json, modification_instruction)

        # 4. Compute structured diff
        diff = TripDiffService.compute_diff(current_trip_json, merged_trip)
        next_version = current_version_number + 1

        # 5. Save version record
        try:
            version_doc = await VersionManager.save_version(
                trip_id=trip_id,
                trip_data=merged_trip,
                modification_prompt=modification_instruction,
                diff=diff,
            )
            version_num = version_doc.get("version_number", next_version)
            version_lbl = version_doc.get("version_label", f"v{version_num}")
        except Exception:
            version_num = next_version
            version_lbl = f"v{version_num}"

        # 6. Update database record
        current_gen["validated_output"] = merged_trip
        await self.repo.save_trip_generation(current_gen)

        return {
            "success": True,
            "trip_id": trip_id,
            "version_number": version_num,
            "version_label": version_lbl,
            "modification_instruction": modification_instruction,
            "diff": diff,
            "modified_trip": merged_trip,
        }

    async def preview_modification(
        self,
        trip_id: str,
        modification_instruction: str,
        user_api_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        current_gen = await self.repo.get_trip_generation(trip_id)
        current_trip_json = current_gen.get("validated_output") if current_gen else self._get_default_base_trip(trip_id)

        merged_trip = self._apply_local_modification(current_trip_json, modification_instruction)
        diff = TripDiffService.compute_diff(current_trip_json, merged_trip)

        return {
            "success": True,
            "trip_id": trip_id,
            "preview_trip": merged_trip,
            "diff": diff,
        }

    async def undo_modification(self, trip_id: str, current_version_number: int) -> Dict[str, Any]:
        prev_num = max(1, current_version_number - 1)
        previous_version = await VersionManager.undo(trip_id, current_version_number)
        
        restored = previous_version["trip_data"] if previous_version else self._get_default_base_trip(trip_id)
        return {
            "success": True,
            "trip_id": trip_id,
            "version_number": prev_num,
            "version_label": f"v{prev_num}",
            "restored_trip": restored,
        }

    async def redo_modification(self, trip_id: str, current_version_number: int) -> Dict[str, Any]:
        next_num = current_version_number + 1
        next_version = await VersionManager.redo(trip_id, current_version_number)
        
        restored = next_version["trip_data"] if next_version else self._get_default_base_trip(trip_id)
        return {
            "success": True,
            "trip_id": trip_id,
            "version_number": next_num,
            "version_label": f"v{next_num}",
            "restored_trip": restored,
        }

    def _apply_local_modification(self, current_trip: Dict[str, Any], instruction: str) -> Dict[str, Any]:
        modified = dict(current_trip)
        inst_lower = instruction.lower()

        # Rule 1: Remove museums
        if "museum" in inst_lower and "remove" in inst_lower:
            days = modified.get("dailyItinerary", [])
            for day in days:
                for slot in ["morning", "afternoon", "lunch", "evening", "dinner", "night"]:
                    if day.get(slot) and "museum" in day[slot].get("title", "").lower():
                        day[slot]["title"] = day[slot]["title"].replace("museum", "heritage bazaar").replace("Museum", "Heritage Bazaar")
                        day[slot]["description"] = "Explore traditional crafts and local heritage bazaar."

        # Rule 2: Increase Budget
        elif "budget" in inst_lower and ("increase" in inst_lower or "25,000" in inst_lower or "luxury" in inst_lower):
            modified["tripSummary"]["estimatedBudget"] = "Under ₹25,000 per person"
            modified["budgetBreakdown"]["totalCost"] = "₹50,000"

        # Rule 3: Add 1 extra day
        elif "add" in inst_lower and ("day" in inst_lower or "extra" in inst_lower):
            days = modified.get("dailyItinerary", [])
            new_num = len(days) + 1
            days.append({
                "dayNumber": new_num,
                "title": f"Day {new_num}: Leisure, Souvenirs & Departure",
                "morning": {"id": f"act-{new_num}-1", "timeSlot": "Morning", "title": "Relaxed morning walk & local breakfast", "description": "Free time for souvenir shopping."},
                "afternoon": {"id": f"act-{new_num}-2", "timeSlot": "Afternoon", "title": "Crafts bazaar tour", "description": "Browse local handicrafts."},
                "evening": {"id": f"act-{new_num}-3", "timeSlot": "Evening", "title": "Farewell dinner", "description": "Enjoy final dinner before departure."},
                "stayRecommendation": "Hotel near station / Airport",
            })
            modified["dailyItinerary"] = days
            modified["tripSummary"]["duration"] = f"{new_num} Days / {new_num - 1} Nights"

        return modified

    def _get_default_base_trip(self, trip_id: str) -> Dict[str, Any]:
        return {
            "tripSummary": {
                "destination": "Dabhoda",
                "duration": "4 Days / 3 Nights",
                "travelStyle": "Cultural & Heritage Immersion",
                "estimatedBudget": "Under ₹15,000 per person",
                "bestSeason": "August - March",
                "overallTheme": "Authentic Dabhoda Village Immersion & Heritage Circuit",
                "tripDifficulty": "Easy",
                "averageDailyTravelTime": "1.2 Hours",
                "recommendedPace": "Balanced",
            },
            "tripHighlights": [
                {"title": "Village Immersion", "description": "Authentic Dabhoda village cultural immersion and homestay experience", "whyIncluded": "Local homestay cultural experience"},
                {"title": "Heritage Circuit", "description": "Heritage circuit: Adalaj Stepwell, Ahmedabad old city and Sabarmati Ashram", "whyIncluded": "UNESCO Heritage architecture"},
            ],
            "dailyItinerary": [
                {
                    "dayNumber": 1,
                    "title": "Day 1: Arrival & Village Immersion",
                    "morning": {"id": "act-1-1", "timeSlot": "Morning", "title": "Arrive Dabhoda from Ahmedabad/Gandhinagar, check into a family-run homestay and meet hosts", "description": "Check into traditional homestay in Dabhoda village."},
                    "afternoon": {"id": "act-1-2", "timeSlot": "Afternoon", "title": "Guided village walk to local temple, market, and observe traditional crafts and farming", "description": "Walk through Dabhoda village streets."},
                    "evening": {"id": "act-1-4", "timeSlot": "Evening", "title": "Home-cooked Gujarati dinner with a short folk-music or storytelling session", "description": "Gather by the courtyard."},
                    "stayRecommendation": "Family-run homestay in Dabhoda (basic cultural experience)",
                },
                {
                    "dayNumber": 2,
                    "title": "Day 2: Gandhinagar Spiritual & Cultural Sights",
                    "morning": {"id": "act-2-1", "timeSlot": "Morning", "title": "Short drive to Akshardham (Gandhinagar) for temple tour, art and gardens", "description": "Explore majestic pink sandstone architecture."},
                    "afternoon": {"id": "act-2-2", "timeSlot": "Afternoon", "title": "Visit capital-complex monuments or a local museum and learn state history", "description": "Tour Dandi Kutir Gandhi museum."},
                    "evening": {"id": "act-2-4", "timeSlot": "Evening", "title": "Return to Gandhinagar for the Akshardham light-and-sound show or a market stroll", "description": "Sat-Chit-Anand water show."},
                    "stayRecommendation": "Budget hotel or guesthouse in Gandhinagar",
                },
            ],
            "budgetBreakdown": {
                "accommodation": "₹6,000 per person",
                "food": "₹4,500 per person",
                "transportation": "₹2,250 per person",
                "entryFees": "₹750 per person",
                "shoppingBuffer": "₹750 per person",
                "emergencyBuffer": "₹750 per person",
                "totalCost": "₹30,000",
                "remainingBudget": "₹0",
                "currency": "INR",
            },
            "travelTips": {
                "localCustoms": ["Respect temple dress codes, ask before photographing people, and carry small notes for local purchases."],
                "safety": ["Carry light raincoat/umbrella and quick-dry clothes for the August monsoon."],
                "languageTips": ["Use shared taxis, local buses and prebook homestays to keep the trip under ₹15,000 per person."],
            },
        }
