import unittest
from app.services.conversational_engine import ConversationalEngine


class TestPhase9ConversationalEngine(unittest.TestCase):
    def test_conversational_engine_initial_draft(self):
        draft = ConversationalEngine.create_empty_draft()
        self.assertEqual(draft["completion_percentage"], 0.0)
        self.assertFalse(draft["is_complete"])
        self.assertEqual(len(draft["missing_fields"]), 9)

    def test_conversational_engine_step_by_step_destination_not_skipped(self):
        draft = ConversationalEngine.create_empty_draft()

        # Step 1: Name
        reply, chips, draft = ConversationalEngine.generate_next_response("My name is Opti Matrix", draft)
        self.assertEqual(draft["name"], "Opti Matrix")
        self.assertIsNone(draft["destination"])

        # Step 2: Travel Style
        reply, chips, draft = ConversationalEngine.generate_next_response("🏛️ Cultural/Historical", draft)
        self.assertEqual(draft["travel_style"], "Cultural/Historical")
        self.assertIsNone(draft["destination"])

        # Step 3: Travelers
        reply, chips, draft = ConversationalEngine.generate_next_response("👨‍👩‍👧 Family (with kids)", draft)
        self.assertEqual(draft["travel_type"], "Family (with kids)")
        self.assertIsNone(draft["destination"])

        # Step 4: Duration
        reply, chips, draft = ConversationalEngine.generate_next_response("📅 Week (4-7 days)", draft)
        self.assertEqual(draft["duration_days"], 5)
        self.assertIsNone(draft["destination"])

        # Step 5: Travel Timing
        reply, chips, draft = ConversationalEngine.generate_next_response("🗓️ 2-3 months away", draft)
        self.assertEqual(draft["travel_timing"], "2-3 months away (August 2026)")
        self.assertIsNone(draft["destination"])

        # Step 6: Budget
        reply, chips, draft = ConversationalEngine.generate_next_response("🧡 ₹50,000 - ₹1,00,000", draft)
        self.assertEqual(draft["budget_per_person"], 50000.0)

        # DESTINATION MUST BE ASKED HERE (NOT SKIPPED!)
        self.assertIsNone(draft["destination"])
        self.assertIn("destinations in mind", reply)

        # Step 7: Destination ("Surprise me!")
        reply, chips, draft = ConversationalEngine.generate_next_response("Surprise me!", draft)
        self.assertEqual(draft["destination"], "Dabhoda")
        self.assertIn("special requirements", reply)

        # Step 8: Special Requirements
        reply, chips, draft = ConversationalEngine.generate_next_response("💰 Budget accommodation", draft)
        self.assertEqual(draft["special_requirements"], "💰 Budget accommodation")
        self.assertIn("phone number and email", reply)

        # Step 9: Contact Info
        reply, chips, draft = ConversationalEngine.generate_next_response("Phone: 9876543210, Email: info@optimatrix.com", draft)
        self.assertTrue(draft["is_complete"])


if __name__ == "__main__":
    unittest.main()
