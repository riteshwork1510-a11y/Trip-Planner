import uuid
import json
import asyncio
from datetime import datetime
from typing import Any, AsyncGenerator, Dict, Optional

from app.services.conversational_engine import ConversationalEngine
from app.services.gemini_service import GeminiService
from app.services.conversation_service import ConversationService
from app.repositories.ai_repository import AIRepository
from app.core.logging_config import logger


class ChatService:
    """
    Orchestrates ChatGPT-style conversational turns, dynamic TripDraft updates,
    suggested quick replies, SSE text streaming, and session history.
    """

    def __init__(
        self,
        gemini_service: Optional[GeminiService] = None,
        conv_service: Optional[ConversationService] = None,
        repo: Optional[AIRepository] = None,
    ):
        self.gemini_service = gemini_service or GeminiService()
        self.conv_service = conv_service or ConversationService(repo=repo)
        self.repo = repo or AIRepository()

    async def process_chat(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
        user_api_key: Optional[str] = None,
    ) -> Dict[str, Any]:
        # 1. Fetch or initialize conversation session
        conv = await self.conv_service.get_or_create_conversation(conversation_id, user_id=user_id)
        conv_id = conv["conversation_id"]

        # Retrieve active TripDraft from conversation context or create new
        existing_draft = conv.get("context", {}).get("trip_draft") or ConversationalEngine.create_empty_draft()

        # 2. Append user message
        await self.conv_service.append_message(conv_id, sender="user", content=message)

        # 3. Process message through ConversationalEngine
        reply_text, quick_replies, updated_draft = ConversationalEngine.generate_next_response(message, existing_draft)

        # 4. Save updated TripDraft context into conversation
        conv["context"]["trip_draft"] = updated_draft
        conv["title"] = f"Trip to {updated_draft.get('destination', 'Travel Destination')}" if updated_draft.get("destination") else conv.get("title", "New Trip Chat")
        await self.repo.save_conversation(conv)

        # 5. Append assistant reply message
        msg = await self.conv_service.append_message(
            conv_id, sender="assistant", content=reply_text, tokens_used=len(reply_text.split())
        )

        return {
            "success": True,
            "conversation_id": conv_id,
            "message_id": msg["id"],
            "reply": reply_text,
            "quick_replies": quick_replies,
            "trip_draft": updated_draft,
            "is_complete": updated_draft.get("is_complete", False),
            "completion_percentage": updated_draft.get("completion_percentage", 0.0),
            "status": "completed",
            "created_at": datetime.utcnow().isoformat(),
        }

    async def stream_chat(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        """
        Yields text tokens progressively as Server-Sent Events (SSE).
        """
        # Execute chat logic
        result = await self.process_chat(message=message, conversation_id=conversation_id, user_id=user_id)
        full_reply = result["reply"]

        # Stream words progressively to simulate real-time AI typing
        words = full_reply.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            sse_event = {
                "event": "message",
                "data": json.dumps({
                    "content": chunk,
                    "conversation_id": result["conversation_id"],
                    "quick_replies": result["quick_replies"] if i == len(words) - 1 else [],
                    "trip_draft": result["trip_draft"] if i == len(words) - 1 else None,
                    "is_complete": result["is_complete"] if i == len(words) - 1 else False,
                })
            }
            yield f"data: {sse_event['data']}\n\n"
            await asyncio.sleep(0.02)  # Smooth 20ms typing effect

    async def reset_conversation(self, conversation_id: str) -> Dict[str, Any]:
        conv = await self.repo.get_conversation(conversation_id)
        if conv:
            empty_draft = ConversationalEngine.create_empty_draft()
            conv["context"]["trip_draft"] = empty_draft
            conv["message_count"] = 0
            await self.repo.save_conversation(conv)
            logger.info(f"Reset trip chat session {conversation_id}")
            return {"success": True, "conversation_id": conversation_id, "trip_draft": empty_draft}
        
        return {"success": False, "message": "Session not found"}
