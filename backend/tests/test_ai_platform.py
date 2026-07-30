import unittest
from app.core.config import get_settings
from app.prompts.prompt_builder import PromptBuilder
from app.validators.response_validator import AIResponseValidator
from app.schemas.ai_schemas import TripGenerationRequest


class TestAIPlatform(unittest.TestCase):
    def test_settings_loaded(self):
        settings = get_settings()
        self.assertTrue(len(settings.APP_NAME) > 0)
        self.assertIsNotNone(settings.GEMINI_API_KEY)

    def test_prompt_builder(self):
        req = TripGenerationRequest(
            destination="Gujarat",
            duration_days=3,
            total_budget=500,
            currency="USD",
            interests=["Culture", "Food"],
        )
        prompt = PromptBuilder.build_trip_generation_prompt(req)
        self.assertIn("Gujarat", prompt)
        self.assertIn("3 Days", prompt)
        self.assertIn("tripSummary", prompt)

    def test_response_validator_repair(self):
        malformed_json = """```json
        {
            "tripSummary": {
                "destination": "Gujarat"
            }
        }
        ```"""
        is_valid, parsed, msg = AIResponseValidator.attempt_json_repair(malformed_json)
        self.assertTrue(is_valid)
        self.assertEqual(parsed["tripSummary"]["destination"], "Gujarat")


if __name__ == "__main__":
    unittest.main()
