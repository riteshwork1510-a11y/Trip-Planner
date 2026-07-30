from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from app.schemas.trip_schema import TripCreate, TripUpdate, ItineraryUpdateRequest
from app.services import trip_service
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/api/trips", tags=["Trips"])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new trip",
)
async def create_trip(data: TripCreate, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        trip = await trip_service.create_trip(user_id, data.model_dump())
        return {
            "success": True,
            "message": "Trip created successfully",
            "data": trip,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": str(e), "error_code": "INTERNAL_ERROR"},
        )


@router.get("", summary="Get all trips for current user")
async def get_trips(
    status_filter: Optional[str] = Query(None, alias="status"),
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        trips = await trip_service.get_user_trips(user_id, status_filter)
        return {
            "success": True,
            "message": "Trips retrieved",
            "data": trips,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.get("/stats", summary="Get trip dashboard stats")
async def get_trip_stats(current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        stats = await trip_service.get_trip_stats(user_id)
        return {
            "success": True,
            "message": "Stats retrieved",
            "data": stats,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.get("/{trip_id}", summary="Get trip by ID")
async def get_trip(trip_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        trip = await trip_service.get_trip_by_id(trip_id, user_id)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Trip not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Trip retrieved",
            "data": trip,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.put("/{trip_id}", summary="Update a trip")
async def update_trip(
    trip_id: str,
    data: TripUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        update_data = {k: v for k, v in data.model_dump().items() if v is not None}
        trip = await trip_service.update_trip(trip_id, user_id, update_data)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Trip not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Trip updated",
            "data": trip,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.delete("/{trip_id}", summary="Delete a trip")
async def delete_trip(trip_id: str, current_user: dict = Depends(get_current_user)):
    try:
        user_id = str(current_user["_id"])
        deleted = await trip_service.delete_trip(trip_id, user_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Trip not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Trip deleted successfully",
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.post("/{trip_id}/ai-update", summary="AI-powered itinerary update")
async def ai_update_itinerary(
    trip_id: str,
    data: ItineraryUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        trip = await trip_service.get_trip_by_id(trip_id, user_id)
        if not trip:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Trip not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "AI itinerary update simulated - real AI integration coming soon",
            "data": trip,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )
