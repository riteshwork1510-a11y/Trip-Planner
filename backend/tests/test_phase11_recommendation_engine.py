import unittest
from app.services.recommendation_ranking_service import RecommendationRankingService
from app.services.recommendation_service import RecommendationService


class TestPhase11RecommendationEngine(unittest.TestCase):
    def test_recommendation_ranking_score(self):
        item = {
            "name": "Heritage Palace Hotel",
            "category": "Heritage Stay",
            "tags": ["Culture", "Luxury", "History"],
            "rating": 4.8,
            "price_tier": "luxury",
            "family_friendly": True,
        }

        score = RecommendationRankingService.calculate_match_score(
            item=item,
            user_interests=["Culture", "History"],
            travel_style="luxury",
            travel_type="family",
        )

        self.assertGreaterEqual(score, 80)
        self.assertLessEqual(score, 100)

    def test_rank_and_score_items(self):
        items = [
            {"name": "Budget Motel", "category": "Budget", "tags": ["Basic"], "rating": 3.2, "price_tier": "budget"},
            {"name": "Cultural Heritage Hotel", "category": "Heritage", "tags": ["Culture", "History"], "rating": 4.9, "price_tier": "moderate"},
        ]

        ranked = RecommendationRankingService.rank_and_score_items(
            items=items,
            user_interests=["Culture", "History"],
            travel_style="moderate",
            travel_type="couple",
        )

        self.assertEqual(len(ranked), 2)
        self.assertEqual(ranked[0]["name"], "Cultural Heritage Hotel")
        self.assertGreater(ranked[0]["match_score"], ranked[1]["match_score"])

    def test_cache_key_generation(self):
        key1 = RecommendationService._generate_cache_key("Gujarat", "Culture", ["Food", "History"])
        key2 = RecommendationService._generate_cache_key("Gujarat", "Culture", ["History", "Food"])
        self.assertEqual(key1, key2)


if __name__ == "__main__":
    unittest.main()
