from typing import Optional, List
from bson import ObjectId

from app.core.database import get_database


def format_destination(dest: dict) -> dict:
    return {
        "id": str(dest["_id"]),
        "name": dest.get("name", ""),
        "country": dest.get("country", ""),
        "description": dest.get("description", ""),
        "image": dest.get("image"),
        "best_season": dest.get("best_season"),
        "avg_duration": dest.get("avg_duration"),
        "rating": dest.get("rating", 4.5),
        "categories": dest.get("categories", []),
    }


async def get_all_destinations(search: Optional[str] = None, category: Optional[str] = None) -> List[dict]:
    db = get_database()
    query = {}

    if search:
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"country": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]

    if category and category != "all":
        query["categories"] = {"$in": [category]}

    cursor = db.destinations.find(query).sort("name", 1)
    destinations = []
    async for dest in cursor:
        destinations.append(format_destination(dest))
    return destinations


async def get_destination_by_id(dest_id: str) -> Optional[dict]:
    db = get_database()
    try:
        dest = await db.destinations.find_one({"_id": ObjectId(dest_id)})
    except Exception:
        return None
    if dest:
        return format_destination(dest)
    return None


async def get_destination_by_name(name: str) -> Optional[dict]:
    db = get_database()
    dest = await db.destinations.find_one({"name": {"$regex": f"^{name}$", "$options": "i"}})
    if dest:
        return format_destination(dest)
    return None


async def create_destination(data: dict) -> dict:
    db = get_database()
    dest_doc = {
        "name": data["name"],
        "country": data["country"],
        "description": data["description"],
        "image": data.get("image"),
        "best_season": data.get("best_season"),
        "avg_duration": data.get("avg_duration"),
        "rating": data.get("rating", 4.5),
        "categories": data.get("categories", []),
    }
    result = await db.destinations.insert_one(dest_doc)
    dest_doc["_id"] = result.inserted_id
    return format_destination(dest_doc)


async def seed_destinations() -> int:
    db = get_database()
    count = await db.destinations.count_documents({})
    if count > 0:
        return 0

    destinations = [
        {
            "name": "Manali",
            "country": "India",
            "description": "Nestled in the Kullu Valley, Manali is a breathtaking hill station surrounded by snow-capped peaks, lush valleys, and serene monasteries. Perfect for adventure enthusiasts and nature lovers alike.",
            "best_season": "October to June",
            "avg_duration": "4-5 Days",
            "rating": 4.7,
            "categories": ["mountains", "adventure"],
        },
        {
            "name": "Goa",
            "country": "India",
            "description": "India's smallest state packs a punch with its golden beaches, vibrant nightlife, Portuguese heritage architecture, and spice plantations. A year-round tropical paradise.",
            "best_season": "November to February",
            "avg_duration": "3-4 Days",
            "rating": 4.6,
            "categories": ["beaches", "nightlife"],
        },
        {
            "name": "Dwarka",
            "country": "India",
            "description": "One of the four sacred Char Dham pilgrimage sites, Dwarka is steeped in mythology and spirituality. Home to the ancient Dwarkadhish Temple and pristine coastal beauty.",
            "best_season": "October to March",
            "avg_duration": "2-3 Days",
            "rating": 4.5,
            "categories": ["spiritual"],
        },
        {
            "name": "Dubai",
            "country": "UAE",
            "description": "A futuristic metropolis rising from the desert, Dubai dazzles with record-breaking skyscrapers, luxury shopping, golden dunes, and world-class entertainment.",
            "best_season": "November to March",
            "avg_duration": "5-6 Days",
            "rating": 4.8,
            "categories": ["international", "luxury"],
        },
        {
            "name": "Paris",
            "country": "France",
            "description": "The City of Light enchants with iconic landmarks, world-renowned cuisine, romantic avenues, and an unparalleled art and culture scene.",
            "best_season": "April to June, September to November",
            "avg_duration": "5-7 Days",
            "rating": 4.9,
            "categories": ["international", "culture"],
        },
        {
            "name": "Bali",
            "country": "Indonesia",
            "description": "The Island of the Gods offers lush rice terraces, ancient temples, vibrant coral reefs, and a unique blend of Hindu culture and tropical beauty.",
            "best_season": "April to October",
            "avg_duration": "6-7 Days",
            "rating": 4.8,
            "categories": ["beaches", "adventure", "international"],
        },
        {
            "name": "Leh-Ladakh",
            "country": "India",
            "description": "A high-altitude desert wilderness of dramatic landscapes, ancient Buddhist monasteries, crystal-clear lakes, and some of the world's most spectacular road trips.",
            "best_season": "June to September",
            "avg_duration": "7-8 Days",
            "rating": 4.8,
            "categories": ["mountains", "adventure"],
        },
        {
            "name": "Kashmir",
            "country": "India",
            "description": "Known as Paradise on Earth, Kashmir mesmerizes with its Mughal gardens, pristine houseboats, snow-capped peaks, and warm hospitality in the Himalayan valley.",
            "best_season": "March to October",
            "avg_duration": "5-6 Days",
            "rating": 4.7,
            "categories": ["mountains", "nature"],
        },
    ]

    result = await db.destinations.insert_many(destinations)
    return len(result.inserted_ids)
