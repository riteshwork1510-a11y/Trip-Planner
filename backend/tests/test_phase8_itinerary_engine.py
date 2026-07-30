import unittest
from app.prompts.prompt_builder import PromptBuilder
from app.validators.response_validator import AIResponseValidator
from app.schemas.ai_schemas import TripGenerationRequest


class TestPhase8ItineraryEngine(unittest.TestCase):
    def test_phase8_trip_generation_request_validation(self):
        req = TripGenerationRequest(
            destination="Gujarat",
            country="India",
            state="Gujarat",
            city="Ahmedabad",
            duration_days=3,
            total_budget=800,
            currency="USD",
            travelers_count=2,
            travel_type="couple",
            travel_style="culture",
            interests=["Culture", "Food"],
        )
        self.assertEqual(req.destination, "Gujarat")
        self.assertEqual(req.duration_days, 3)
        self.assertEqual(req.travelers_count, 2)

    def test_phase8_prompt_builder_structure(self):
        req = TripGenerationRequest(
            destination="Goa",
            duration_days=4,
            total_budget=1200,
            currency="USD",
            travelers_count=2,
            travel_style="Beaches & Nightlife",
            interests=["Beaches", "Food"],
            preferred_pace="balanced",
        )
        prompt = PromptBuilder.build_trip_generation_prompt(req)
        self.assertIn("Goa", prompt)
        self.assertIn("4 Days", prompt)
        self.assertIn("tripSummary", prompt)

    def test_phase8_response_validator_full_schema(self):
        sample_json = """{
          "tripSummary": {
            "destination": "Gujarat",
            "duration": "3 Days / 2 Nights",
            "travelStyle": "Culture & Heritage",
            "estimatedBudget": "$600",
            "bestSeason": "October - March",
            "overallTheme": "Heritage & Cuisine",
            "tripDifficulty": "Easy",
            "averageDailyTravelTime": "1.5 Hours",
            "recommendedPace": "Balanced"
          },
          "tripHighlights": [
            {
              "title": "Sabarmati Ashram Visit",
              "description": "Historical Mahatma Gandhi residence",
              "whyIncluded": "Fits historical interest"
            }
          ],
          "dailyItinerary": [
            {
              "dayNumber": 1,
              "title": "Day 1: Heritage Walk",
              "morning": {"id": "1", "timeSlot": "Morning", "title": "Ashram", "description": "Walk", "location": "Ahmedabad", "estimatedCost": "$5", "category": "Culture"},
              "afternoon": {"id": "2", "timeSlot": "Afternoon", "title": "Museum", "description": "Tour", "location": "Ahmedabad", "estimatedCost": "$10", "category": "Culture"},
              "lunch": {"id": "3", "timeSlot": "Lunch", "title": "Thali", "description": "Gujarati Thali", "location": "Local Restaurant", "estimatedCost": "$15", "category": "Food"},
              "evening": {"id": "4", "timeSlot": "Evening", "title": "Lake Walk", "description": "Kankaria Lake", "location": "Ahmedabad", "estimatedCost": "$5", "category": "Relaxation"},
              "dinner": {"id": "5", "timeSlot": "Dinner", "title": "Dinner", "description": "Heritage Dining", "location": "Old City", "estimatedCost": "$20", "category": "Food"},
              "night": {"id": "6", "timeSlot": "Night", "title": "Rest", "description": "Hotel Check-in", "location": "Hotel", "estimatedCost": "$0", "category": "Relaxation"},
              "estimatedCost": "$55",
              "travelDistance": "10 km",
              "travelTime": "1 Hour",
              "stayRecommendation": "Heritage Hotel"
            }
          ],
          "budgetBreakdown": {
            "accommodation": "$200",
            "food": "$150",
            "transportation": "$100",
            "entryFees": "$50",
            "shoppingBuffer": "$50",
            "emergencyBuffer": "$50",
            "totalCost": "$550",
            "remainingBudget": "$250",
            "currency": "USD"
          },
          "hotelRecommendation": [
            {
              "hotelName": "House of MG",
              "hotelArea": "Old City",
              "hotelCategory": "4-Star Heritage",
              "estimatedPrice": "$100/night",
              "reasonForRecommendation": "Authentic Gujarati architecture",
              "nearbyAttractions": ["Sabarmati Riverfront"]
            }
          ],
          "restaurantRecommendation": {
            "breakfast": {"restaurantName": "Bhatiyar Gali", "cuisine": "Local Breakfast", "estimatedCost": "$5", "reason": "Traditional", "nearbyAttraction": "Old City"},
            "lunch": {"restaurantName": "Agashiye", "cuisine": "Gujarati Thali", "estimatedCost": "$20", "reason": "Famous Thali", "nearbyAttraction": "House of MG"},
            "dinner": {"restaurantName": "Vishalla", "cuisine": "Village Dining", "estimatedCost": "$25", "reason": "Cultural Vibe", "nearbyAttraction": "Sarkhej Roza"}
          },
          "transportRecommendation": [
            {"mode": "Taxi / Auto", "travelTime": "1.5 Hours/day", "estimatedCost": "$30/day", "reason": "Easy local commuting"}
          ],
          "packingChecklist": {
            "clothing": ["Cotton clothes"],
            "electronics": ["Phone charger"],
            "documents": ["ID card"],
            "health": ["Sunscreen"],
            "weatherItems": ["Sunglasses"],
            "photography": ["Camera"],
            "localEssentials": ["Cash"]
          },
          "travelTips": {
            "localCustoms": ["Dry state rules"],
            "dressCode": ["Modest wear"],
            "safety": ["Safe environment"],
            "weather": ["Pleasant winters"],
            "photographyEtiquette": ["Ask before photo"],
            "languageTips": ["Gujarati / Hindi"]
          },
          "emergencyAdvice": ["Dial 112"],
          "weatherAdvice": "Pleasant during winter months.",
          "importantNotes": ["Book Thali in advance."]
        }"""

        success, parsed, msg = AIResponseValidator.attempt_json_repair(sample_json)
        self.assertTrue(success)
        self.assertEqual(parsed["tripSummary"]["destination"], "Gujarat")

        is_valid, missing = AIResponseValidator.validate_trip_schema(parsed)
        self.assertTrue(is_valid)
        self.assertEqual(len(missing), 0)


if __name__ == "__main__":
    unittest.main()
