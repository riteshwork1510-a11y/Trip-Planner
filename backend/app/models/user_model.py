from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field


class UserModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    full_name: str
    email: str
    password_hash: str
    profile_image: Optional[str] = None
    phone_number: Optional[str] = None
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None
    default_currency: Optional[str] = None
    travel_style: Optional[str] = None
    food_preference: Optional[str] = None
    preferred_activities: Optional[List[str]] = Field(default=[])
    default_budget_range: Optional[str] = None

    class Config:
        populate_by_name = True
