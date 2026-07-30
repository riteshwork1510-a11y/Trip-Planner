from typing import Any, Dict, List


class RecommendationRankingService:
    """
    Computes a personalized 0-100 Smart Match Score for recommended items
    based on budget alignment, interest overlap, ratings, and accessibility.
    """

    @classmethod
    def calculate_match_score(
        cls,
        item: Dict[str, Any],
        user_interests: List[str],
        travel_style: str = "moderate",
        travel_type: str = "couple",
    ) -> int:
        score = 50.0  # Base score

        # 1. User Interest Alignment (Up to +30)
        item_category = item.get("category", "").lower()
        item_tags = [t.lower() for t in item.get("tags", [])]
        user_interests_lower = [i.lower() for i in user_interests]

        match_count = sum(
            1 for interest in user_interests_lower
            if interest in item_category or any(interest in tag for tag in item_tags)
        )
        if match_count >= 2:
            score += 30.0
        elif match_count == 1:
            score += 20.0

        # 2. Rating Score (Up to +15)
        rating = item.get("rating", 4.5)
        if isinstance(rating, (int, float)):
            score += min(15.0, (rating / 5.0) * 15.0)

        # 3. Travel Style / Budget Match (Up to +15)
        price_tier = item.get("price_tier", "moderate").lower()
        if travel_style.lower() in price_tier or price_tier in travel_style.lower():
            score += 15.0
        elif travel_style.lower() == "budget" and price_tier == "budget":
            score += 15.0
        elif travel_style.lower() == "luxury" and price_tier == "luxury":
            score += 15.0

        # 4. Family / Accessibility bonus (Up to +10)
        if travel_type.lower() in ["family", "senior"] and item.get("family_friendly", True):
            score += 10.0

        return int(min(100.0, max(40.0, score)))

    @classmethod
    def rank_and_score_items(
        cls,
        items: List[Dict[str, Any]],
        user_interests: List[str],
        travel_style: str = "moderate",
        travel_type: str = "couple",
    ) -> List[Dict[str, Any]]:
        for item in items:
            match_score = cls.calculate_match_score(
                item=item,
                user_interests=user_interests,
                travel_style=travel_style,
                travel_type=travel_type,
            )
            item["match_score"] = match_score

        # Sort descending by match_score
        return sorted(items, key=lambda x: x.get("match_score", 0), reverse=True)
