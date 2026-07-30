from datetime import datetime
from typing import Any, Dict, List, Optional
from app.core.database import get_database
from app.core.logging_config import logger


class VersionManager:
    """
    Manages trip version history (v1, v2, v3...), Undo / Redo stacks,
    and version restoration persisted in MongoDB collection `trip_versions`.
    """

    @classmethod
    async def create_version_indexes(cls):
        try:
            db = get_database()
            await db.trip_versions.create_index([("trip_id", 1), ("version_number", 1)], unique=True)
            logger.info("MongoDB index verified for trip_versions collection.")
        except Exception as e:
            logger.warning(f"Error creating trip_versions index: {e}")

    @classmethod
    async def save_version(
        cls,
        trip_id: str,
        trip_data: Dict[str, Any],
        modification_prompt: str = "Initial Generation",
        diff: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        db = get_database()

        # Find current highest version number
        cursor = db.trip_versions.find({"trip_id": trip_id}).sort("version_number", -1).limit(1)
        latest_versions = await cursor.to_list(length=1)

        version_number = (latest_versions[0]["version_number"] + 1) if latest_versions else 1

        version_doc = {
            "version_id": f"ver-{trip_id}-v{version_number}",
            "trip_id": trip_id,
            "version_number": version_number,
            "version_label": f"v{version_number}",
            "modification_prompt": modification_prompt,
            "diff": diff or {},
            "trip_data": trip_data,
            "created_at": datetime.utcnow(),
        }

        await db.trip_versions.insert_one(version_doc)
        logger.info(f"Saved version v{version_number} for trip {trip_id}")
        return version_doc

    @classmethod
    async def get_version_history(cls, trip_id: str) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.trip_versions.find({"trip_id": trip_id}, {"_id": 0}).sort("version_number", 1)
        return await cursor.to_list(length=100)

    @classmethod
    async def undo(cls, trip_id: str, current_version_number: int) -> Optional[Dict[str, Any]]:
        target_version = max(1, current_version_number - 1)
        db = get_database()
        return await db.trip_versions.find_one({"trip_id": trip_id, "version_number": target_version}, {"_id": 0})

    @classmethod
    async def redo(cls, trip_id: str, current_version_number: int) -> Optional[Dict[str, Any]]:
        target_version = current_version_number + 1
        db = get_database()
        return await db.trip_versions.find_one({"trip_id": trip_id, "version_number": target_version}, {"_id": 0})
