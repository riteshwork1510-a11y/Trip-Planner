import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from app.core.database import get_database
from app.core.logging_config import logger


class AIRepository:
    def __init__(self):
        self.db = get_database()

    async def create_indexes(self):
        """Ensure collection indexes exist for fast queries."""
        try:
            db = get_database()
            await db.ai_conversations.create_index("conversation_id", unique=True)
            await db.ai_messages.create_index("conversation_id")
            await db.trip_requests.create_index("request_id", unique=True)
            # Sparse unique index: allows multiple null values but enforces uniqueness on non-null
            try:
                await db.trip_generations.drop_index("generation_id_1")
            except:
                pass
            await db.trip_generations.create_index("generation_id", unique=True, sparse=True)
            await db.prompt_logs.create_index("log_id", unique=True)
            logger.info("MongoDB indexes verified for AI collections.")
        except Exception as e:
            logger.warning(f"Error initializing MongoDB indexes: {e}")

    # ── Conversations ────────────────────────────────
    async def save_conversation(self, conversation_data: Dict[str, Any]) -> str:
        db = get_database()
        conversation_data["updated_at"] = datetime.utcnow()
        await db.ai_conversations.update_one(
            {"conversation_id": conversation_data["conversation_id"]},
            {"$set": conversation_data},
            upsert=True,
        )
        return conversation_data["conversation_id"]

    async def get_conversation(self, conversation_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        return await db.ai_conversations.find_one({"conversation_id": conversation_id}, {"_id": 0})

    # ── Messages ─────────────────────────────────────
    async def save_message(self, message_data: Dict[str, Any]) -> str:
        db = get_database()
        if "created_at" not in message_data:
            message_data["created_at"] = datetime.utcnow()
        await db.ai_messages.insert_one(message_data)
        return message_data.get("conversation_id", "")

    async def get_messages_for_conversation(self, conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        db = get_database()
        cursor = db.ai_messages.find({"conversation_id": conversation_id}, {"_id": 0}).sort("created_at", 1).limit(limit)
        return await cursor.to_list(length=limit)

    # ── Trip Requests & Generations ──────────────────
    async def save_trip_request(self, request_data: Dict[str, Any]) -> str:
        db = get_database()
        if "created_at" not in request_data:
            request_data["created_at"] = datetime.utcnow()
        await db.trip_requests.insert_one(request_data)
        return request_data["request_id"]

    async def save_trip_generation(self, generation_data: Dict[str, Any]) -> str:
        db = get_database()
        if "created_at" not in generation_data:
            generation_data["created_at"] = datetime.utcnow()
        if "updated_at" not in generation_data:
            generation_data["updated_at"] = datetime.utcnow()
        # Ensure generation_id is never null (unique index constraint)
        if not generation_data.get("generation_id"):
            generation_data["generation_id"] = f"gen-{uuid.uuid4().hex[:12]}"
        await db.trip_generations.insert_one(generation_data)
        return generation_data["generation_id"]

    async def get_trip_generation(self, generation_id: str) -> Optional[Dict[str, Any]]:
        db = get_database()
        return await db.trip_generations.find_one({"generation_id": generation_id}, {"_id": 0})

    # ── Prompt Logs ──────────────────────────────────
    async def save_prompt_log(self, log_data: Dict[str, Any]) -> str:
        db = get_database()
        if "created_at" not in log_data:
            log_data["created_at"] = datetime.utcnow()
        await db.prompt_logs.insert_one(log_data)
        return log_data["log_id"]

    # ── History Queries ──────────────────────────────
    async def get_history_list(self, user_id: Optional[str] = None, limit: int = 20, skip: int = 0) -> List[Dict[str, Any]]:
        db = get_database()
        query: Dict[str, Any] = {}
        if user_id:
            query["user_id"] = user_id

        # Fetch generations and conversations
        generations_cursor = db.trip_generations.find(query, {"_id": 0}).sort("created_at", -1).skip(skip).limit(limit)
        generations = await generations_cursor.to_list(length=limit)

        results = []
        for g in generations:
            results.append({
                "id": g.get("generation_id"),
                "type": "trip_generation",
                "title": f"{g.get('destination')} Trip Plan",
                "summary": f"Generated using {g.get('model_used')}",
                "created_at": g.get("created_at", datetime.utcnow()),
                "status": g.get("status", "completed"),
            })

        return results

    async def delete_history_item(self, item_id: str) -> bool:
        db = get_database()
        res1 = await db.trip_generations.delete_one({"generation_id": item_id})
        res2 = await db.ai_conversations.delete_one({"conversation_id": item_id})
        return (res1.deleted_count > 0) or (res2.deleted_count > 0)
