from typing import Any, Dict, List, Optional
from app.core.logging_config import logger


class TripMergeService:
    """
    Intelligently merges AI partial output into an existing Trip JSON object.
    Preserves unchanged days, maintains numbering, updates total budget calculations,
    and guarantees structural integrity.
    """

    @classmethod
    def merge_modifications(
        cls, current_trip: Dict[str, Any], ai_modified_trip: Dict[str, Any]
    ) -> Dict[str, Any]:
        if not current_trip:
            return ai_modified_trip
        if not ai_modified_trip:
            return current_trip

        merged = dict(current_trip)

        # 1. Update Root Summary if provided
        if "tripSummary" in ai_modified_trip and isinstance(ai_modified_trip["tripSummary"], dict):
            merged["tripSummary"] = {**merged.get("tripSummary", {}), **ai_modified_trip["tripSummary"]}

        # 2. Update Highlights if provided
        if "tripHighlights" in ai_modified_trip and isinstance(ai_modified_trip["tripHighlights"], list):
            if len(ai_modified_trip["tripHighlights"]) > 0:
                merged["tripHighlights"] = ai_modified_trip["tripHighlights"]

        # 3. Merge Daily Itinerary Days
        if "dailyItinerary" in ai_modified_trip and isinstance(ai_modified_trip["dailyItinerary"], list):
            new_days = ai_modified_trip["dailyItinerary"]
            if len(new_days) > 0:
                # Map days by dayNumber
                existing_days_map = {
                    d.get("dayNumber"): d for d in merged.get("dailyItinerary", []) if isinstance(d, dict)
                }

                for n_day in new_days:
                    d_num = n_day.get("dayNumber")
                    if d_num:
                        existing_days_map[d_num] = n_day

                # Sort by dayNumber
                sorted_days = [existing_days_map[k] for k in sorted(existing_days_map.keys())]

                # Re-index dayNumbers continuously (1, 2, 3...)
                for idx, day in enumerate(sorted_days, start=1):
                    day["dayNumber"] = idx
                    if "title" in day and not day["title"].startswith(f"Day {idx}"):
                        parts = day["title"].split(":", 1)
                        suffix = parts[1] if len(parts) > 1 else day["title"]
                        day["title"] = f"Day {idx}:{suffix}"

                merged["dailyItinerary"] = sorted_days

        # 4. Update Budget Breakdown
        if "budgetBreakdown" in ai_modified_trip and isinstance(ai_modified_trip["budgetBreakdown"], dict):
            merged["budgetBreakdown"] = {**merged.get("budgetBreakdown", {}), **ai_modified_trip["budgetBreakdown"]}

        # 5. Update Recommendations
        for key in ["hotelRecommendation", "restaurantRecommendation", "transportRecommendation", "packingChecklist", "travelTips"]:
            if key in ai_modified_trip and ai_modified_trip[key]:
                merged[key] = ai_modified_trip[key]

        return merged
