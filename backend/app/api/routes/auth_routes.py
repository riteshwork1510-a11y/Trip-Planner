from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from app.schemas.auth_schema import (
    UserRegister,
    UserLogin,
    ChangePassword,
    RefreshTokenRequest,
)
from app.services.auth_service import (
    register_user,
    login_user,
    refresh_access_token,
    logout_user,
    change_user_password,
    get_user_by_id,
)
from app.dependencies.auth_dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email and password.",
)
async def register(data: UserRegister):
    try:
        user = await register_user(data)
        return {
            "success": True,
            "message": "User registered successfully",
            "data": user,
        }
    except ValueError as e:
        error_message = str(e)
        if "already exists" in error_message.lower():
            error_code = "DUPLICATE_EMAIL"
            status_code_val = status.HTTP_409_CONFLICT
        elif "password" in error_message.lower():
            error_code = "WEAK_PASSWORD"
            status_code_val = status.HTTP_422_UNPROCESSABLE_ENTITY
        else:
            error_code = "VALIDATION_ERROR"
            status_code_val = status.HTTP_422_UNPROCESSABLE_ENTITY
        raise HTTPException(
            status_code=status_code_val,
            detail={
                "success": False,
                "message": error_message,
                "error_code": error_code,
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
            },
        )


@router.post(
    "/login",
    summary="Login user",
    description="Authenticate user and return access and refresh tokens.",
)
async def login(data: UserLogin, response: Response):
    try:
        result = await login_user(data)
        response.set_cookie(
            key="refresh_token",
            value=result["refresh_token"],
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=30 * 24 * 60 * 60,
        )
        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "access_token": result["access_token"],
                "token_type": "bearer",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": str(e),
                "error_code": "INVALID_CREDENTIALS",
            },
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "Internal server error",
                "error_code": "INTERNAL_ERROR",
            },
        )


@router.post(
    "/refresh",
    summary="Refresh access token",
    description="Use refresh token to get a new access token.",
)
async def refresh(request: Request):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            try:
                body = await request.json()
                if body:
                    refresh_token = body.get("refresh_token")
            except Exception:
                pass

        if not refresh_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "Refresh token not provided",
                    "error_code": "MISSING_REFRESH_TOKEN",
                },
            )

        result = await refresh_access_token(refresh_token)
        return {
            "success": True,
            "message": "Access token refreshed",
            "data": {
                "access_token": result["access_token"],
                "token_type": "bearer",
            },
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "success": False,
                "message": str(e),
                "error_code": "INVALID_REFRESH_TOKEN",
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


@router.post(
    "/logout",
    summary="Logout user",
    description="Invalidate refresh token and clear authentication cookies.",
)
async def logout(request: Request, response: Response):
    try:
        refresh_token = request.cookies.get("refresh_token")
        if not refresh_token:
            try:
                body = await request.json()
                refresh_token = body.get("refresh_token") if body else None
            except Exception:
                pass

        await logout_user(refresh_token)
        response.delete_cookie(
            key="refresh_token",
            httponly=True,
            secure=False,
            samesite="lax",
        )
        return {
            "success": True,
            "message": "Logged out successfully",
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


@router.get(
    "/me",
    summary="Get current user",
    description="Get the authenticated user's profile information.",
)
async def get_me(current_user: dict = Depends(get_current_user)):
    from app.services.auth_service import format_user_response

    try:
        user_data = format_user_response(current_user)
        return {
            "success": True,
            "message": "User profile retrieved",
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


@router.post(
    "/change-password",
    summary="Change password",
    description="Change the authenticated user's password.",
)
async def change_password(
    data: ChangePassword,
    current_user: dict = Depends(get_current_user),
):
    from bson import ObjectId

    try:
        user_id = str(current_user["_id"])
        await change_user_password(user_id, data)
        return {
            "success": True,
            "message": "Password changed successfully. Please login again.",
        }
    except ValueError as e:
        error_message = str(e)
        if "incorrect" in error_message.lower():
            error_code = "INVALID_CURRENT_PASSWORD"
        elif "password" in error_message.lower():
            error_code = "WEAK_PASSWORD"
        else:
            error_code = "VALIDATION_ERROR"
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "success": False,
                "message": error_message,
                "error_code": error_code,
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
