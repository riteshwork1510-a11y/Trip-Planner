from typing import Optional
from fastapi import APIRouter, Query, status, Body

from app.schemas.ai_schemas import (
    AIChatRequest,
    TripGenerationRequest,
    TripGenerationResponse,
    RegenerateRequest,
    HistoryListResponse,
    HistoryDetailResponse,
    GenericSuccessResponse,
)
from app.controllers.ai_controller import AIController

router = APIRouter(prefix="/api/v1/ai", tags=["Natural Language Itinerary Modification Engine"])
ai_controller = AIController()


# ── PHASE 10 NATURAL LANGUAGE MODIFICATION ENDPOINTS ───────────

@router.post(
    "/trip/modify",
    status_code=status.HTTP_200_OK,
    summary="Modify itinerary with natural language",
    description="Applies natural language instruction ('Remove museums', 'Increase budget to $2500', 'Add 1 day') to only affected parts of an existing trip.",
)
async def modify_trip_endpoint(
    trip_id: str = Body(..., embed=True),
    modification_instruction: str = Body(..., embed=True),
    version_number: int = Body(default=1, embed=True),
    user_api_key: Optional[str] = Body(default=None, embed=True),
):
    return await ai_controller.handle_modify_trip(
        trip_id=trip_id,
        modification_instruction=modification_instruction,
        version_number=version_number,
        user_api_key=user_api_key,
    )


@router.post(
    "/trip/preview",
    status_code=status.HTTP_200_OK,
    summary="Preview natural language modification before applying",
    description="Generates modified preview and diff without creating a new version until user confirms.",
)
async def preview_trip_endpoint(
    trip_id: str = Body(..., embed=True),
    modification_instruction: str = Body(..., embed=True),
    user_api_key: Optional[str] = Body(default=None, embed=True),
):
    return await ai_controller.handle_preview_trip(
        trip_id=trip_id,
        modification_instruction=modification_instruction,
        user_api_key=user_api_key,
    )


@router.post(
    "/trip/undo",
    status_code=status.HTTP_200_OK,
    summary="Undo last modification",
    description="Reverts trip itinerary to previous version number (v2 -> v1).",
)
async def undo_trip_endpoint(
    trip_id: str = Body(..., embed=True),
    current_version_number: int = Body(default=2, embed=True),
):
    return await ai_controller.handle_undo_trip(trip_id=trip_id, current_version_number=current_version_number)


@router.post(
    "/trip/redo",
    status_code=status.HTTP_200_OK,
    summary="Redo previously undone modification",
    description="Re-applies previously undone version (v1 -> v2).",
)
async def redo_trip_endpoint(
    trip_id: str = Body(..., embed=True),
    current_version_number: int = Body(default=1, embed=True),
):
    return await ai_controller.handle_redo_trip(trip_id=trip_id, current_version_number=current_version_number)


@router.get(
    "/trip/history",
    status_code=status.HTTP_200_OK,
    summary="Get trip version history stack",
    description="Retrieves list of all saved versions (v1, v2, v3...) and diffs for a trip ID.",
)
async def get_trip_version_history_endpoint(trip_id: str = Query(...)):
    return await ai_controller.handle_get_version_history(trip_id)


# ── CONVERSATIONAL CHAT ENDPOINTS ───────────────────────────────

@router.post("/chat", status_code=status.HTTP_200_OK)
async def chat_endpoint(request: AIChatRequest):
    return await ai_controller.handle_chat(request)


@router.post("/chat/stream")
async def chat_stream_endpoint(request: AIChatRequest):
    return await ai_controller.handle_chat_stream(request)


@router.get("/chat/history", response_model=HistoryListResponse, status_code=status.HTTP_200_OK)
async def get_chat_history_endpoint(limit: int = Query(default=20, ge=1), skip: int = Query(default=0, ge=0)):
    return await ai_controller.handle_list_trips(limit=limit, skip=skip)


@router.get("/chat/{conversation_id}", response_model=HistoryDetailResponse, status_code=status.HTTP_200_OK)
async def get_chat_detail_endpoint(conversation_id: str):
    return await ai_controller.handle_get_trip_by_id(conversation_id)


@router.delete("/chat/{conversation_id}", response_model=GenericSuccessResponse, status_code=status.HTTP_200_OK)
async def delete_chat_endpoint(conversation_id: str):
    return await ai_controller.handle_delete_trip(conversation_id)


@router.post("/chat/reset", status_code=status.HTTP_200_OK)
async def reset_chat_endpoint(conversation_id: str = Body(..., embed=True)):
    return await ai_controller.handle_reset_chat(conversation_id)


# ── ITINERARY GENERATION ENDPOINTS ─────────────────────────────

@router.post("/generate-trip", response_model=TripGenerationResponse, status_code=status.HTTP_200_OK)
async def generate_trip_endpoint(request: TripGenerationRequest):
    return await ai_controller.handle_generate_trip(request)


@router.post("/regenerate-trip", response_model=TripGenerationResponse, status_code=status.HTTP_200_OK)
async def regenerate_trip_endpoint(request: RegenerateRequest):
    return await ai_controller.handle_regenerate_trip(request)


@router.get("/trips/{trip_id}", response_model=HistoryDetailResponse, status_code=status.HTTP_200_OK)
async def get_trip_by_id_endpoint(trip_id: str):
    return await ai_controller.handle_get_trip_by_id(trip_id)


@router.get("/trips", response_model=HistoryListResponse, status_code=status.HTTP_200_OK)
async def list_trips_endpoint(limit: int = Query(default=20, ge=1), skip: int = Query(default=0, ge=0)):
    return await ai_controller.handle_list_trips(limit=limit, skip=skip)


@router.delete("/trips/{trip_id}", response_model=GenericSuccessResponse, status_code=status.HTTP_200_OK)
async def delete_trip_endpoint(trip_id: str):
    return await ai_controller.handle_delete_trip(trip_id)
