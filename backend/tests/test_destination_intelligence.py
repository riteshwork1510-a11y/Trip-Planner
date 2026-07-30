import unittest
import asyncio
from app.schemas.intelligence_schemas import IntelligenceRequest
from app.services.destination_intelligence_service import DestinationIntelligenceService
from app.services.distance_matrix_service import DistanceMatrixService
from app.services.ranking_and_day_planner import RankingEngine, DayPlanner
from app.services.context_builder import ContextBuilder


class TestDestinationIntelligence(unittest.TestCase):
    def test_distance_matrix_calculation(self):
        attractions = [
            type("Place", (), {"name": "Dwarkadhish Temple", "latitude": 22.2404, "longitude": 68.9685})(),
            type("Place", (), {"name": "Rukmini Temple", "latitude": 22.2612, "longitude": 68.9780})(),
        ]
        matrix = DistanceMatrixService.generate_distance_matrix(attractions)
        self.assertEqual(len(matrix), 1)
        self.assertGreater(matrix[0].distance_km, 0)
        self.assertEqual(matrix[0].from_place, "Dwarkadhish Temple")
        self.assertEqual(matrix[0].to_place, "Rukmini Temple")

    def test_knowledge_graph_assembly(self):
        req = IntelligenceRequest(
            destination="Dwarka",
            duration_days=3,
            budget_per_person=15000.0,
            travel_style="Cultural",
            interests=["History", "Heritage", "Local Culture"],
        )
        graph = asyncio.run(DestinationIntelligenceService.build_knowledge_graph(req))
        self.assertEqual(graph.destination, "Dwarka")
        self.assertGreater(len(graph.attractions), 0)
        self.assertGreater(len(graph.distance_matrix), 0)

        # Build Context Prompt
        prompt = ContextBuilder.build_enriched_prompt(graph)
        self.assertIn("Dwarkadhish Temple", prompt)
        self.assertIn("STRICT GENERATION RULES", prompt)


if __name__ == "__main__":
    unittest.main()
