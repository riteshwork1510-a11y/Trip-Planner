from typing import Any, Dict, List, Optional
from app.repositories.ai_repository import AIRepository
from app.schemas.ai_schemas import HistoryListResponse, HistoryDetailResponse, HistoryItem
from app.core.exceptions import ResourceNotFoundException


class HistoryService:
    """
    Manages historical AI interactions, trip generations, and chat logs.
    """

    def __init__(self, repo: Optional[AIRepository] = None):
        self.repo = repo or AIRepository()

    async def get_history(self, user_id: Optional[str] = None, limit: int = 20, skip: int = 0) -> HistoryListResponse:
        items_raw = await self.repo.get_history_list(user_id=user_id, limit=limit, skip=skip)
        history_items = [HistoryItem(**item) for item in items_raw]
        return HistoryListResponse(
            success=True,
            total_count=len(history_items),
            items=history_items,
        )

    async def get_history_detail(self, history_id: str) -> HistoryDetailResponse:
        # Check trip generations first
        gen = await self.repo.get_trip_generation(history_id)
        if gen:
            return HistoryDetailResponse(
                success=True,
                id=history_id,
                type="trip_generation",
                data=gen.get("validated_output", {}),
                created_at=gen.get("created_at"),
            )

        # Check conversations
        conv = await self.repo.get_conversation(history_id)
        if conv:
            messages = await self.repo.get_messages_for_conversation(history_id)
            return HistoryDetailResponse(
                success=True,
                id=history_id,
                type="chat_session",
                data={"conversation": conv, "messages": messages},
                created_at=conv.get("created_at"),
            )

        raise ResourceNotFoundException(message=f"History record with ID '{history_id}' not found.")

    async def delete_history_item(self, history_id: str) -> bool:
        deleted = await self.repo.delete_history_item(history_id)
        if not deleted:
            raise ResourceNotFoundException(message=f"Cannot delete. Record '{history_id}' not found.")
        return True
