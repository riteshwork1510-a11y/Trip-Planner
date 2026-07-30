from typing import Any, Dict, List, Optional


class TripDiffService:
    """
    Computes structured diffs (added, removed, modified, moved) between two trip versions.
    Used for live previews, diff highlighting, and version auditing.
    """

    @classmethod
    def compute_diff(cls, old_trip: Dict[str, Any], new_trip: Dict[str, Any]) -> Dict[str, Any]:
        diffs = {
            "added": [],
            "removed": [],
            "modified": [],
            "summary_changes": [],
        }

        if not old_trip or not new_trip:
            return diffs

        # 1. Summary / Budget Changes
        old_budget = old_trip.get("budgetBreakdown", {}).get("totalCost", "")
        new_budget = new_trip.get("budgetBreakdown", {}).get("totalCost", "")
        if old_budget != new_budget:
            diffs["summary_changes"].append({
                "field": "totalCost",
                "old": old_budget,
                "new": new_budget,
                "description": f"Total Budget changed from {old_budget} to {new_budget}",
            })

        # 2. Compare Days & Activities
        old_days = {d.get("dayNumber"): d for d in old_trip.get("dailyItinerary", []) if isinstance(d, dict)}
        new_days = {d.get("dayNumber"): d for d in new_trip.get("dailyItinerary", []) if isinstance(d, dict)}

        # Added Days
        for day_num, day_data in new_days.items():
            if day_num not in old_days:
                diffs["added"].append({
                    "type": "day",
                    "dayNumber": day_num,
                    "title": day_data.get("title", f"Day {day_num}"),
                    "description": f"Added Day {day_num}",
                })

        # Removed Days
        for day_num, day_data in old_days.items():
            if day_num not in new_days:
                diffs["removed"].append({
                    "type": "day",
                    "dayNumber": day_num,
                    "title": day_data.get("title", f"Day {day_num}"),
                    "description": f"Removed Day {day_num}",
                })

        # Compare activities inside common days
        slots = ["morning", "afternoon", "lunch", "evening", "dinner", "night"]
        for day_num in set(old_days.keys()).intersection(set(new_days.keys())):
            o_day = old_days[day_num]
            n_day = new_days[day_num]

            for slot in slots:
                o_act = o_day.get(slot)
                n_act = n_day.get(slot)

                if o_act and isinstance(o_act, dict) and n_act and isinstance(n_act, dict):
                    if o_act.get("title") != n_act.get("title"):
                        diffs["modified"].append({
                            "type": "activity",
                            "dayNumber": day_num,
                            "slot": slot,
                            "oldTitle": o_act.get("title"),
                            "newTitle": n_act.get("title"),
                            "description": f"Day {day_num} {slot.capitalize()}: Replaced '{o_act.get('title')}' with '{n_act.get('title')}'",
                        })

        return diffs
