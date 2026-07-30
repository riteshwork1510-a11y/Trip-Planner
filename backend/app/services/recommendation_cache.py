from datetime import datetime
from typing import Any, Dict, Optional
from app.core.database import get_database
from app.core.logging_config import logger


class RecommendationCache:
    """
    In-memory and MongoDB cache service for storing generated recommendation outputs
    keyed by destination, travel style, and interests hash.
    """

    @classmethod
    async def get_cached_recommendation(cls, cache_key: str) -> Optional[Dict[str, Any]]:
        try:
            db = get_database()
            cached = await db.recommendations_cache.find_one({"cache_key": cache_key}, {"_id": 0})
            if cached:
                logger.info(f"Recommendation cache hit for '{cache_key}'")
                return cached.get("data")
        except Exception as e:
            logger.warning(f"Error fetching recommendation cache: {e}")
        return None

    @classmethod
    async def set_cached_recommendation(cls, cache_key: str, data: Dict[str, Any]) -> None:
        try:
            db = get_database()
            cache_doc = {
                "cache_key": cache_key,
                "data": data,
                "created_at": datetime.utcnow(),
            }
            await db.recommendations_cache.update_one(
                {"cache_key": cache_key},
                {"$set": cache_doc},
                upsert=True,
            )
            logger.info(f"Cached recommendations for '{cache_key}'")
        except Exception as e:
            logger.warning(f"Error setting recommendation cache: {e}")
