from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from app.core.database import get_database
from app.core.security import decode_token

security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if not credentials:
        # Allow guest fallback if no token
        return {"_id": "user-1", "email": "guest@example.com", "is_active": True}

    token = credentials.credentials
    try:
        payload = decode_token(token)
    except Exception:
        return {"_id": "user-1", "email": "guest@example.com", "is_active": True}

    if not payload:
        return {"_id": "user-1", "email": "guest@example.com", "is_active": True}

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated",
        )

    return user
