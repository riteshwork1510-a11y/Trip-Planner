from typing import Dict, Any, List
from app.schemas.intelligence_schemas import DestinationKnowledgeGraph, DestinationClassification

class DestinationClassifier:
    """
    Analyzes destination attractions and determines the true nature of the location.
    This protects the planner from blindly applying mismatched travel styles 
    (e.g., "Romantic Dinner" or "Nightclub" at a "Pilgrimage" destination).
    """

    # Static rule engine based on common destination categories
    RULES: Dict[str, Dict[str, Any]] = {
        "Temple": {
            "keywords": ["temple", "shrine", "ashram", "matha", "mandir", "church", "mosque", "dargah"],
            "allowed_styles": ["Spiritual", "Photography", "Cultural", "Family", "Senior Citizen", "Pilgrimage", "Architecture", "History", "Food", "Local Culture", "Hidden Gems", "Luxury"],
            "forbidden_activities": ["Nightclub", "Pub Crawl", "Bar Hopping", "Beach Party", "Luxury Nightlife", "Casino", "Romantic Dinner", "Romantic Walk", "Romantic Sunset", "Couple Activities", "Clubbing", "Party"]
        },
        "Beach": {
            "keywords": ["beach", "coast", "shore", "island", "sea", "ocean"],
            "allowed_styles": ["Romantic", "Luxury", "Water Sports", "Sunset", "Photography", "Nightlife", "Honeymoon", "Family", "Relaxation", "Adventure"],
            "forbidden_activities": ["Skiing", "Snowboarding"]
        },
        "Adventure": {
            "keywords": ["trek", "hike", "mountain", "peak", "valley", "camp", "rafting", "paragliding"],
            "allowed_styles": ["Camping", "Hiking", "ATV", "River Rafting", "Paragliding", "Photography", "Adventure", "Nature", "Backpacking"],
            "forbidden_activities": ["Luxury Nightlife", "Casino", "High-end Shopping"]
        },
        "Historical": {
            "keywords": ["fort", "palace", "monument", "ruins", "unesco", "heritage", "museum", "tomb"],
            "allowed_styles": ["History", "Architecture", "Cultural", "Photography", "Family", "Educational", "Luxury"],
            "forbidden_activities": ["Nightclub", "Beach Party", "Casino"]
        },
        "Wildlife": {
            "keywords": ["national park", "wildlife", "sanctuary", "safari", "zoo", "reserve"],
            "allowed_styles": ["Nature", "Photography", "Safari", "Adventure", "Family", "Eco-tourism"],
            "forbidden_activities": ["Nightclub", "Pub Crawl", "Loud Music", "Party", "Shopping Spree"]
        }
    }

    @classmethod
    def classify(cls, graph: DestinationKnowledgeGraph) -> DestinationClassification:
        """
        Determine the destination type by analyzing the categories and names of the attractions.
        Returns a DestinationClassification object.
        """
        category_scores: Dict[str, int] = {key: 0 for key in cls.RULES.keys()}

        # Always check the destination name itself first
        dest_lower = graph.destination.lower()
        for c_type, rules in cls.RULES.items():
            for kw in rules["keywords"]:
                if kw in dest_lower:
                    category_scores[c_type] += 5  # Strong signal if in name

        # Check attractions
        for place in graph.attractions:
            place_text = (place.name + " " + place.category).lower()
            for c_type, rules in cls.RULES.items():
                for kw in rules["keywords"]:
                    if kw in place_text:
                        category_scores[c_type] += 1
        
        # Find the highest scoring category
        best_category = "General City"
        max_score = 0
        for c_type, score in category_scores.items():
            if score > max_score:
                max_score = score
                best_category = c_type

        # If no strong match, return a general classification
        if max_score < 2:
            return DestinationClassification(
                destination_type="General City",
                allowed_styles=["All"],
                forbidden_activities=[]
            )

        rules = cls.RULES[best_category]
        return DestinationClassification(
            destination_type=best_category,
            allowed_styles=rules["allowed_styles"],
            forbidden_activities=rules["forbidden_activities"]
        )
