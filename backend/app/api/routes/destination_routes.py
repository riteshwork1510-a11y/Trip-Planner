from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import Optional
from app.schemas.destination_schema import DestinationCreate
from app.services import destination_service
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/api/destinations", tags=["Destinations"])


@router.get("", summary="Get all destinations")
async def get_destinations(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
):
    try:
        destinations = await destination_service.get_all_destinations(search, category)
        return {
            "success": True,
            "message": "Destinations retrieved",
            "data": destinations,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.get("/{dest_id}", summary="Get destination by ID")
async def get_destination(dest_id: str):
    try:
        dest = await destination_service.get_destination_by_id(dest_id)
        if not dest:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"success": False, "message": "Destination not found", "error_code": "NOT_FOUND"},
            )
        return {
            "success": True,
            "message": "Destination retrieved",
            "data": dest,
        }
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.post("/seed", summary="Seed default destinations")
async def seed_destinations():
    try:
        count = await destination_service.seed_destinations()
        return {
            "success": True,
            "message": f"Seeded {count} destinations" if count > 0 else "Destinations already exist",
            "data": {"count": count},
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new destination (admin)",
)
async def create_destination(data: DestinationCreate):
    try:
        dest = await destination_service.create_destination(data.model_dump())
        return {
            "success": True,
            "message": "Destination created",
            "data": dest,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
        )
