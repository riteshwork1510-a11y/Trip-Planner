import unittest
from app.services.trip_merge_service import TripMergeService
from app.services.trip_diff_service import TripDiffService
from app.prompts.prompt_builder import PromptBuilder


class TestPhase10ModificationEngine(unittest.TestCase):
    def test_trip_merge_service(self):
        original = {
            "tripSummary": {"destination": "Gujarat", "estimatedBudget": "$600"},
            "dailyItinerary": [
                {"dayNumber": 1, "title": "Day 1: Arrival"},
                {"dayNumber": 2, "title": "Day 2: Temples"},
            ],
        }

        ai_partial = {
            "tripSummary": {"estimatedBudget": "$900"},
            "dailyItinerary": [
                {"dayNumber": 2, "title": "Day 2: Museums & Parks"},
            ],
        }

        merged = TripMergeService.merge_modifications(original, ai_partial)
        self.assertEqual(merged["tripSummary"]["estimatedBudget"], "$900")
        self.assertEqual(len(merged["dailyItinerary"]), 2)
        self.assertIn("Museums & Parks", merged["dailyItinerary"][1]["title"])

    def test_trip_diff_service(self):
        old_trip = {
            "budgetBreakdown": {"totalCost": "$600"},
            "dailyItinerary": [
                {"dayNumber": 1, "morning": {"title": "Temple Visit"}},
            ],
        }

        new_trip = {
            "budgetBreakdown": {"totalCost": "$900"},
            "dailyItinerary": [
                {"dayNumber": 1, "morning": {"title": "Museum Tour"}},
                {"dayNumber": 2, "morning": {"title": "Beach Walk"}},
            ],
        }

        diff = TripDiffService.compute_diff(old_trip, new_trip)
        self.assertEqual(len(diff["added"]), 1)  # Added Day 2
        self.assertEqual(len(diff["modified"]), 1)  # Modified Day 1 morning activity
        self.assertEqual(len(diff["summary_changes"]), 1)  # Budget change

    def test_prompt_builder_modification_prompt(self):
        current_trip = {"destination": "Gujarat", "dailyItinerary": []}
        prompt = PromptBuilder.build_trip_modification_prompt(current_trip, "Remove museums and add more food places")
        self.assertIn("Remove museums", prompt)
        self.assertIn("Gujarat", prompt)
        self.assertIn("CRITICAL INSTRUCTIONS FOR PARTIAL MODIFICATION", prompt)


if __name__ == "__main__":
    unittest.main()
