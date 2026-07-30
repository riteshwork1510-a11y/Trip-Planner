from typing import Any, Dict, Optional
from fastapi.responses import StreamingResponse
from app.schemas.ai_schemas import (
    AIChatRequest,
    TripGenerationRequest,
    TripGenerationResponse,
    RegenerateRequest,
    HistoryListResponse,
    HistoryDetailResponse,
    GenericSuccessResponse,
)
from app.services.chat_service import ChatService
from app.services.trip_service import TripService
from app.services.history_service import HistoryService
from app.services.modification_service import ModificationService
from app.services.version_manager import VersionManager


class AIController:
    """
    Controller layer for AI platform API endpoints.
    Pure orchestration: Delegates all domain and business logic to dedicated services.
    """

    def __init__(
        self,
        chat_service: Optional[ChatService] = None,
        trip_service: Optional[TripService] = None,
        history_service: Optional[HistoryService] = None,
        modification_service: Optional[ModificationService] = None,
    ):
        self.chat_service = chat_service or ChatService()
        self.trip_service = trip_service or TripService()
        self.history_service = history_service or HistoryService()
        self.modification_service = modification_service or ModificationService()

    async def handle_chat(self, request: AIChatRequest, user_id: Optional[str] = None) -> Dict[str, Any]:
        return await self.chat_service.process_chat(
            message=request.message,
            conversation_id=request.conversation_id,
            user_id=user_id,
            user_api_key=request.user_api_key,
        )

    async def handle_chat_stream(self, request: AIChatRequest, user_id: Optional[str] = None) -> StreamingResponse:
        generator = self.chat_service.stream_chat(
            message=request.message,
            conversation_id=request.conversation_id,
            user_id=user_id,
        )
        return StreamingResponse(generator, media_type="text/event-stream")

    async def handle_reset_chat(self, conversation_id: str) -> Dict[str, Any]:
        return await self.chat_service.reset_conversation(conversation_id)

    async def handle_generate_trip(self, request: TripGenerationRequest, user_id: Optional[str] = None) -> TripGenerationResponse:
        return await self.trip_service.generate_trip(request, user_id=user_id)

    async def handle_regenerate_trip(self, request: RegenerateRequest, user_id: Optional[str] = None) -> TripGenerationResponse:
        return await self.trip_service.regenerate_trip(request, user_id=user_id)

    # ── Phase 10 Natural Language Modification Handlers ──
    async def handle_modify_trip(self, trip_id: str, modification_instruction: str, version_number: int = 1, user_api_key: Optional[str] = None) -> Dict[str, Any]:
        return await self.modification_service.modify_trip(
            trip_id=trip_id,
            modification_instruction=modification_instruction,
            current_version_number=version_number,
            user_api_key=user_api_key,
        )

    async def handle_preview_trip(self, trip_id: str, modification_instruction: str, user_api_key: Optional[str] = None) -> Dict[str, Any]:
        return await self.modification_service.preview_modification(
            trip_id=trip_id,
            modification_instruction=modification_instruction,
            user_api_key=user_api_key,
        )

    async def handle_undo_trip(self, trip_id: str, current_version_number: int) -> Dict[str, Any]:
        return await self.modification_service.undo_modification(trip_id, current_version_number)

    async def handle_redo_trip(self, trip_id: str, current_version_number: int) -> Dict[str, Any]:
        return await self.modification_service.redo_modification(trip_id, current_version_number)

    async def handle_get_version_history(self, trip_id: str) -> Dict[str, Any]:
        history = await VersionManager.get_version_history(trip_id)
        return {"success": True, "trip_id": trip_id, "versions": history}

    async def handle_get_trip_by_id(self, trip_id: str) -> HistoryDetailResponse:
        return await self.history_service.get_history_detail(trip_id)

    async def handle_list_trips(self, limit: int = 20, skip: int = 0) -> HistoryListResponse:
        return await self.history_service.get_history(limit=limit, skip=skip)

    async def handle_delete_trip(self, trip_id: str) -> GenericSuccessResponse:
        await self.history_service.delete_history_item(trip_id)
        return GenericSuccessResponse(success=True, message=f"Trip record '{trip_id}' deleted successfully.")
