import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from app.repositories.ai_repository import AIRepository
from app.core.logging_config import logger


class ConversationService:
    """
    Manages chat session lifecycle, conversation context, and historical message persistence.
    """

    def __init__(self, repo: Optional[AIRepository] = None):
        self.repo = repo or AIRepository()

    async def get_or_create_conversation(self, conversation_id: Optional[str] = None, user_id: Optional[str] = None) -> Dict[str, Any]:
        if conversation_id:
            conv = await self.repo.get_conversation(conversation_id)
            if conv:
                return conv

        # Create new session
        new_id = conversation_id or f"conv-{uuid.uuid4().hex[:12]}"
        new_conv = {
            "conversation_id": new_id,
            "user_id": user_id,
            "title": "Travel Chat Session",
            "context": {},
            "message_count": 0,
            "status": "active",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
        }
        await self.repo.save_conversation(new_conv)
        logger.info(f"Initialized new AI conversation session: {new_id}")
        return new_conv

    async def append_message(self, conversation_id: str, sender: str, content: str, tokens_used: Optional[int] = 0) -> Dict[str, Any]:
        msg = {
            "id": f"msg-{uuid.uuid4().hex[:12]}",
            "conversation_id": conversation_id,
            "sender": sender,
            "content": content,
            "tokens_used": tokens_used,
            "created_at": datetime.utcnow(),
        }
        await self.repo.save_message(msg)
        
        # Update conversation message count
        conv = await self.repo.get_conversation(conversation_id)
        if conv:
            conv["message_count"] = conv.get("message_count", 0) + 1
            await self.repo.save_conversation(conv)

        return msg

    async def get_conversation_history(self, conversation_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        return await self.repo.get_messages_for_conversation(conversation_id, limit=limit)
