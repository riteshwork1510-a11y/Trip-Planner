from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.core.database import get_database
from app.core.security import (
    hash_password,
    verify_password,
    validate_password_strength,
    create_access_token,
    create_refresh_token,
    decode_token,
    get_refresh_token_expiry,
)
from app.schemas.auth_schema import UserRegister, UserLogin, ChangePassword


def format_user_response(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "email": user["email"],
        "profile_image": user.get("profile_image"),
        "phone_number": user.get("phone_number"),
        "is_active": user.get("is_active", True),
        "is_verified": user.get("is_verified", False),
        "created_at": user["created_at"],
        "updated_at": user["updated_at"],
        "last_login": user.get("last_login"),
        "default_currency": user.get("default_currency"),
        "travel_style": user.get("travel_style"),
        "food_preference": user.get("food_preference"),
        "preferred_activities": user.get("preferred_activities", []),
        "default_budget_range": user.get("default_budget_range"),
    }


def format_user_safe(user: dict) -> dict:
    return {
        "id": str(user["_id"]),
        "full_name": user["full_name"],
        "email": user["email"],
        "created_at": user["created_at"],
    }


async def register_user(data: UserRegister) -> dict:
    db = get_database()

    existing_user = await db.users.find_one({"email": data.email.lower().strip()})
    if existing_user:
        raise ValueError("A user with this email already exists")

    is_valid, error_msg = validate_password_strength(data.password)
    if not is_valid:
        raise ValueError(error_msg)

    now = datetime.now(timezone.utc)
    user_doc = {
        "full_name": data.full_name.strip(),
        "email": data.email.lower().strip(),
        "password_hash": hash_password(data.password),
        "profile_image": None,
        "phone_number": data.phone_number,
        "is_active": True,
        "is_verified": False,
        "created_at": now,
        "updated_at": now,
        "last_login": None,
        "default_currency": data.default_currency,
        "travel_style": data.travel_style,
        "food_preference": data.food_preference,
        "preferred_activities": [],
        "default_budget_range": None,
    }

    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    return format_user_safe(user_doc)


async def login_user(data: UserLogin) -> dict:
    db = get_database()

    email = data.email.lower().strip()
    user = await db.users.find_one({"email": email})

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(data.password, user["password_hash"]):
        raise ValueError("Invalid email or password")

    if not user.get("is_active", True):
        raise ValueError("Account is deactivated. Please contact support.")

    now = datetime.now(timezone.utc)
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": now}},
    )

    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id, email)

    token_expiry = get_refresh_token_expiry()
    refresh_doc = {
        "user_id": user_id,
        "token": refresh_token,
        "expires_at": token_expiry,
        "created_at": now,
        "is_revoked": False,
    }
    await db.refresh_tokens.insert_one(refresh_doc)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
    }


async def refresh_access_token(refresh_token: str) -> dict:
    db = get_database()

    payload = decode_token(refresh_token)
    if not payload:
        raise ValueError("Invalid or expired refresh token")

    if payload.get("type") != "refresh":
        raise ValueError("Invalid token type")

    user_id = payload.get("user_id")
    if not user_id:
        raise ValueError("Invalid token payload")

    stored_token = await db.refresh_tokens.find_one(
        {"token": refresh_token, "is_revoked": False}
    )
    if not stored_token:
        raise ValueError("Refresh token has been revoked")

    if stored_token["expires_at"].replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        await db.refresh_tokens.delete_one({"_id": stored_token["_id"]})
        raise ValueError("Refresh token has expired")

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user or not user.get("is_active", True):
        raise ValueError("User not found or inactive")

    new_access_token = create_access_token(user_id, user["email"])

    return {"access_token": new_access_token}


async def logout_user(refresh_token: str = None) -> None:
    db = get_database()

    if refresh_token:
        await db.refresh_tokens.update_one(
            {"token": refresh_token},
            {"$set": {"is_revoked": True}},
        )


async def change_user_password(user_id: str, data: ChangePassword) -> None:
    db = get_database()

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise ValueError("User not found")

    if not verify_password(data.current_password, user["password_hash"]):
        raise ValueError("Current password is incorrect")

    is_valid, error_msg = validate_password_strength(data.new_password)
    if not is_valid:
        raise ValueError(error_msg)

    new_hash = hash_password(data.new_password)
    now = datetime.now(timezone.utc)
    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"password_hash": new_hash, "updated_at": now}},
    )

    await db.refresh_tokens.update_many(
        {"user_id": user_id, "is_revoked": False},
        {"$set": {"is_revoked": True}},
    )


async def get_user_by_id(user_id: str) -> Optional[dict]:
    db = get_database()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return format_user_response(user)
    return None


async def update_user_profile(user_id: str, update_data: dict) -> dict:
    db = get_database()

    allowed_fields = {"full_name", "phone_number", "profile_image"}
    update_fields = {k: v for k, v in update_data.items() if k in allowed_fields and v is not None}

    if not update_fields:
        raise ValueError("No valid fields to update")

    if "full_name" in update_fields:
        update_fields["full_name"] = update_fields["full_name"].strip()

    update_fields["updated_at"] = datetime.now(timezone.utc)

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields},
    )

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return format_user_response(user)


async def update_user_preferences(user_id: str, update_data: dict) -> dict:
    db = get_database()

    allowed_fields = {
        "default_currency",
        "travel_style",
        "food_preference",
        "preferred_activities",
        "default_budget_range",
    }
    update_fields = {k: v for k, v in update_data.items() if k in allowed_fields and v is not None}

    if not update_fields:
        raise ValueError("No valid fields to update")

    update_fields["updated_at"] = datetime.now(timezone.utc)

    await db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields},
    )

    user = await db.users.find_one({"_id": ObjectId(user_id)})
    return format_user_response(user)
