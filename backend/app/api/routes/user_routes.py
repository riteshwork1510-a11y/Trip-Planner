from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.user_schema import UserUpdate, PreferencesUpdate
from app.services.auth_service import (
    update_user_profile,
    update_user_preferences,
    format_user_response,
)
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/api/user", tags=["User Profile"])


@router.get(
    "/profile",
    summary="Get user profile",
    description="Get the authenticated user's full profile.",
)
async def get_profile(current_user: dict = Depends(get_current_user)):
    try:
        user_data = format_user_response(current_user)
        return {
            "success": True,
            "message": "Profile retrieved successfully",
            "data": user_data,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
            },
        )


@router.put(
    "/profile",
    summary="Update user profile",
    description="Update the authenticated user's profile information.",
)
async def update_profile(
    data: UserUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        update_dict = data.model_dump(exclude_unset=True)
        updated_user = await update_user_profile(user_id, update_dict)
        return {
            "success": True,
            "message": "Profile updated successfully",
            "data": updated_user,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "message": str(e),
                "error_code": "VALIDATION_ERROR",
            },
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
            },
        )


@router.put(
    "/preferences",
    summary="Update travel preferences",
    description="Update the authenticated user's travel preferences.",
)
async def update_preferences(
    data: PreferencesUpdate,
    current_user: dict = Depends(get_current_user),
):
    try:
        user_id = str(current_user["_id"])
        update_dict = data.model_dump(exclude_unset=True)
        updated_user = await update_user_preferences(user_id, update_dict)
        return {
            "success": True,
            "message": "Preferences updated successfully",
            "data": updated_user,
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "message": str(e),
                "error_code": "VALIDATION_ERROR",
            },
        )
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
            },
        )
