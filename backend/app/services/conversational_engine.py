import re
from typing import Any, Dict, List, Optional, Tuple


class ConversationalEngine:
    """
    Stateful conversational engine that asks questions 1-by-1 in the user's exact requested sequence,
    maintains an internal TripDraft, validates inputs, and triggers Gemini itinerary generation
    ONLY after all required steps are collected.
    """

    REQUIRED_FIELDS = [
        "name",
        "travel_style",
        "travel_type",
        "duration_days",
        "travel_timing",
        "total_budget",
        "destination",
        "special_requirements",
        "contact_info",
    ]

    @classmethod
    def create_empty_draft(cls) -> Dict[str, Any]:
        return {
            "name": None,
            "destination": None,
            "duration_days": None,
            "travel_timing": None,
            "total_budget": None,
            "budget_per_person": None,
            "currency": "INR",
            "travelers_count": 2,
            "travel_type": None,
            "travel_style": None,
            "interests": [],
            "special_requirements": None,
            "contact_info": None,
            "phone": None,
            "email": None,
            "completion_percentage": 0.0,
            "missing_fields": cls.REQUIRED_FIELDS.copy(),
            "is_complete": False,
        }

    @classmethod
    def calculate_completion(cls, draft: Dict[str, Any]) -> Tuple[float, List[str]]:
        missing = []
        if not draft.get("name"):
            missing.append("name")
        if not draft.get("travel_style"):
            missing.append("travel_style")
        if not draft.get("travel_type"):
            missing.append("travel_type")
        if not draft.get("duration_days"):
            missing.append("duration_days")
        if not draft.get("travel_timing"):
            missing.append("travel_timing")
        if not draft.get("total_budget") and not draft.get("budget_per_person"):
            missing.append("total_budget")
        if not draft.get("destination"):
            missing.append("destination")
        if not draft.get("special_requirements"):
            missing.append("special_requirements")
        if not draft.get("contact_info"):
            missing.append("contact_info")

        collected_count = len(cls.REQUIRED_FIELDS) - len(missing)
        percentage = round((collected_count / len(cls.REQUIRED_FIELDS)) * 100.0, 1)

        return percentage, missing

    @classmethod
    def parse_user_intent_and_update_draft(cls, message: str, draft: Dict[str, Any]) -> Dict[str, Any]:
        text = message.strip()
        text_lower = text.lower()
        updated = dict(draft)

        # 0. Currency
        if "inr" in text_lower or "₹" in text or "rupee" in text_lower or "rupees" in text_lower:
            updated["currency"] = "INR"

        # Step 1. Extract Name
        if not draft.get("name"):
            name_match = re.search(r"(?:my name is|i'm|i am|call me|name is)\s+([a-zA-Z\s]+)", text, re.IGNORECASE)
            if name_match:
                updated["name"] = name_match.group(1).strip().title()
            elif len(text.split()) <= 2 and text_lower not in ["hi", "hello", "hey", "yes", "book", "trip", "plan"]:
                updated["name"] = text.strip().title()
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 2. Extract Travel Style
        if not draft.get("travel_style"):
            if "cultural" in text_lower or "historic" in text_lower or "heritage" in text_lower or "🏛️" in text:
                updated["travel_style"] = "Cultural/Historical"
                updated["interests"] = ["History & Heritage", "Local Culture"]
            elif "nature" in text_lower or "wildlife" in text_lower or "🌿" in text:
                updated["travel_style"] = "Nature & Wildlife"
                updated["interests"] = ["Nature", "Wildlife"]
            elif "adventure" in text_lower or "🏔️" in text:
                updated["travel_style"] = "Adventure"
                updated["interests"] = ["Adventure", "Trekking"]
            elif "beach" in text_lower or "relaxation" in text_lower or "🏖️" in text:
                updated["travel_style"] = "Beach & Relaxation"
                updated["interests"] = ["Beaches", "Relaxation"]
            elif "food" in text_lower or "culinary" in text_lower or "🍽️" in text:
                updated["travel_style"] = "Food & Culinary"
                updated["interests"] = ["Food", "Local Cuisine"]
            else:
                updated["travel_style"] = text.strip()
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 3. Extract Travelers
        if not draft.get("travel_type"):
            if "family" in text_lower or "kids" in text_lower or "👨‍👩‍👧" in text:
                updated["travel_type"] = "Family (with kids)"
                updated["travelers_count"] = 4
            elif "couple" in text_lower or "2 person" in text_lower or "2 traveler" in text_lower or "👨‍❤️‍👨" in text:
                updated["travel_type"] = "Couple (2 persons)"
                updated["travelers_count"] = 2
            elif "solo" in text_lower or "1 person" in text_lower or "🎒" in text:
                updated["travel_type"] = "Solo (1 person)"
                updated["travelers_count"] = 1
            elif "friend" in text_lower or "group" in text_lower or "🥳" in text:
                updated["travel_type"] = "Friends Group"
                updated["travelers_count"] = 4
            else:
                updated["travel_type"] = text.strip()
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 4. Extract Duration
        if not draft.get("duration_days"):
            if "3 night" in text_lower or "3 nights" in text_lower:
                updated["duration_days"] = 4
            elif "2 night" in text_lower or "weekend" in text_lower or "⚡" in text:
                updated["duration_days"] = 3
            elif "week" in text_lower or "4-7" in text_lower or "📅" in text:
                updated["duration_days"] = 5
            elif "long" in text_lower or "8+" in text_lower or "🌴" in text:
                updated["duration_days"] = 9
            else:
                duration_match = re.search(r"(\d+)\s*(?:day|days|d)", text_lower)
                if duration_match:
                    updated["duration_days"] = int(duration_match.group(1))
                else:
                    updated["duration_days"] = 4
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 5. Extract Travel Timing
        if not draft.get("travel_timing"):
            if "30 day" in text_lower or "this week" in text_lower or "next" in text_lower:
                updated["travel_timing"] = "Next 30 days"
            elif "2-3 month" in text_lower or "2-3 months" in text_lower or "2026-08" in text_lower:
                updated["travel_timing"] = "2-3 months away (August 2026)"
            else:
                updated["travel_timing"] = "Flexible / Later this year"
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 6. Extract Budget
        if not draft.get("total_budget") and not draft.get("budget_per_person"):
            if "15,000" in text or "15000" in text:
                updated["budget_per_person"] = 15000.0
                updated["total_budget"] = 15000.0 * updated.get("travelers_count", 2)
            elif "50,000" in text or "50000" in text or "1,00,000" in text:
                updated["budget_per_person"] = 50000.0
                updated["total_budget"] = 50000.0 * updated.get("travelers_count", 2)
            elif "10,000" in text or "10000" in text:
                updated["budget_per_person"] = 10000.0
                updated["total_budget"] = 10000.0 * updated.get("travelers_count", 2)
            else:
                budget_match = re.search(r"(?:₹|inr|usd|\$)?\s*(\d[\d,]*)\b", text_lower)
                if budget_match:
                    val = float(budget_match.group(1).replace(",", ""))
                    updated["budget_per_person"] = val
                    updated["total_budget"] = val * updated.get("travelers_count", 2)
                else:
                    updated["budget_per_person"] = 25000.0
                    updated["total_budget"] = 50000.0
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 7. Extract Destination
        if not draft.get("destination"):
            if "surprise" in text_lower:
                updated["destination"] = "Dabhoda"
            elif "dabhoda" in text_lower:
                updated["destination"] = "Dabhoda"
            elif any(place in text_lower for place in ["gujarat", "goa", "dubai", "bali", "paris", "switzerland", "tokyo", "kerala", "maldives"]):
                for place in ["Gujarat", "Goa", "Dubai", "Bali", "Paris", "Switzerland", "Tokyo", "Kerala", "Maldives"]:
                    if place.lower() in text_lower:
                        updated["destination"] = place
                        break
            else:
                dest_match = re.search(r"(?:to|visit|explore|in|destination)\s+([a-zA-Z\s]+)", text, re.IGNORECASE)
                if dest_match:
                    updated["destination"] = dest_match.group(1).strip().title()
                else:
                    updated["destination"] = text.strip().title()
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 8. Extract Special Requirements
        if not draft.get("special_requirements"):
            updated["special_requirements"] = text.strip()
            percentage, missing = cls.calculate_completion(updated)
            updated["completion_percentage"] = percentage
            updated["missing_fields"] = missing
            return updated

        # Step 9. Extract Contact Info
        if not draft.get("contact_info"):
            updated["contact_info"] = text.strip()
            if "@" in text:
                updated["email"] = text.strip()
            if re.search(r"\d{10}", text):
                updated["phone"] = text.strip()

        percentage, missing = cls.calculate_completion(updated)
        updated["completion_percentage"] = percentage
        updated["missing_fields"] = missing
        updated["is_complete"] = len(missing) == 0
        return updated

    @classmethod
    def generate_next_response(cls, message: str, draft: Dict[str, Any]) -> Tuple[str, List[Dict[str, str]], Dict[str, Any]]:
        updated_draft = cls.parse_user_intent_and_update_draft(message, draft)
        name_str = f", {updated_draft['name']}" if updated_draft.get("name") else ""

        # Step 1: Ask Name
        if not updated_draft.get("name"):
            reply = "Awesome! I'd love to help you book a trip. What's your name? 😊"
            quick_replies = [
                {"label": "Opti Matrix", "value": "My name is Opti Matrix"},
                {"label": "Ritesh", "value": "My name is Ritesh"},
            ]
            return reply, quick_replies, updated_draft

        # Step 2: Travel Style
        if not updated_draft.get("travel_style"):
            reply = f"Great{name_str}! What type of travel interests you?"
            quick_replies = [
                {"label": "🏛️ Cultural/Historical", "value": "🏛️ Cultural/Historical"},
                {"label": "🌿 Nature & Wildlife", "value": "🌿 Nature & Wildlife"},
                {"label": "🏔️ Adventure", "value": "🏔️ Adventure"},
                {"label": "🏖️ Beach & Relaxation", "value": "🏖️ Beach & Relaxation"},
                {"label": "🍽️ Food & Culinary", "value": "🍽️ Food & Culinary"},
            ]
            return reply, quick_replies, updated_draft

        # Step 3: Number of Travelers
        if not updated_draft.get("travel_type"):
            reply = "How many travelers will be joining?"
            quick_replies = [
                {"label": "🎒 Solo (1 person)", "value": "Solo (1 person)"},
                {"label": "👨‍❤️‍👨 Couple (2 persons)", "value": "Couple (2 persons)"},
                {"label": "👨‍👩‍👧 Family (with kids)", "value": "Family (with kids)"},
                {"label": "🥳 Friends Group", "value": "Friends Group"},
            ]
            return reply, quick_replies, updated_draft

        # Step 4: Duration
        if not updated_draft.get("duration_days"):
            reply = "What's your ideal trip duration?"
            quick_replies = [
                {"label": "⚡ Weekend (2-3 days)", "value": "Weekend (2-3 days)"},
                {"label": "📅 Week (4-7 days)", "value": "Week (4-7 days)"},
                {"label": "🌴 Long Vacation (8+ days)", "value": "Long Vacation (8+ days)"},
            ]
            return reply, quick_replies, updated_draft

        # Step 5: Travel Timing
        if not updated_draft.get("travel_timing"):
            reply = "When are you planning to travel?"
            quick_replies = [
                {"label": "🗓️ Next 30 days", "value": "Next 30 days"},
                {"label": "🗓️ 2-3 months away", "value": "2-3 months away"},
                {"label": "🗓️ Later this year", "value": "Later this year"},
            ]
            return reply, quick_replies, updated_draft

        # Step 6: Budget per person (INR)
        if not updated_draft.get("total_budget") and not updated_draft.get("budget_per_person"):
            reply = "What's your approximate budget per person (INR)?"
            quick_replies = [
                {"label": "💰 Under ₹15,000", "value": "Under ₹15,000 per person"},
                {"label": "🧡 ₹15,000 - ₹50,000", "value": "₹15,000 - ₹50,000 per person"},
                {"label": "🧡 ₹50,000 - ₹1,00,000", "value": "₹50,000 - ₹1,00,000 per person"},
                {"label": "💎 ₹1,00,000+", "value": "₹1,00,000+ per person"},
            ]
            return reply, quick_replies, updated_draft

        # Step 7: Destination Question
        if not updated_draft.get("destination"):
            reply = "Do you have any specific destinations in mind? (type a destination or say 'Surprise me!') 🌍"
            quick_replies = [
                {"label": "Dabhoda 🇮🇳", "value": "Dabhoda"},
                {"label": "Gujarat 🇮🇳", "value": "Gujarat"},
                {"label": "Goa 🏖️", "value": "Goa"},
                {"label": "Surprise me! ✨", "value": "Surprise me!"},
            ]
            return reply, quick_replies, updated_draft

        # Step 8: Special Requirements
        if not updated_draft.get("special_requirements"):
            dest = updated_draft.get("destination", "Dabhoda")
            reply = f"Perfect, we'll surprise you with some amazing cultural/historical gems in **{dest}**! ✨ Any special requirements?"
            quick_replies = [
                {"label": "💰 Budget accommodation", "value": "Budget accommodation"},
                {"label": "🌿 Vegetarian food", "value": "Vegetarian food"},
                {"label": "♿ Wheelchair accessible", "value": "Wheelchair accessible"},
                {"label": "Family friendly", "value": "Family friendly"},
            ]
            return reply, quick_replies, updated_draft

        # Step 9: Contact Info
        if not updated_draft.get("contact_info"):
            reply = "What's the best way to reach you? Please share your phone number and email. 📱"
            quick_replies = [
                {"label": "optimatrix@example.com", "value": "Phone: 9876543210, Email: optimatrix@example.com"},
            ]
            return reply, quick_replies, updated_draft

        # Step 10: All Steps Complete -> Generate Itinerary!
        dest = updated_draft.get("destination", "Dabhoda")
        reply = (
            f"Perfect{name_str}! 🎉 Generating your custom day-by-day travel plan for **{dest}** now..."
        )
        quick_replies = []
        updated_draft["is_complete"] = True
        return reply, quick_replies, updated_draft
