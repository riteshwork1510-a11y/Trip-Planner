from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr
from app.schemas.auth_schema import TokenResponse


class UserProfile(BaseModel):
    id: str = Field(..., description="User ID")
    full_name: str = Field(..., description="User's full name")
    email: str = Field(..., description="User's email address")
    profile_image: Optional[str] = Field(None, description="Profile image URL")
    phone_number: Optional[str] = Field(None, description="Phone number")
    is_active: bool = Field(True, description="Account active status")
    is_verified: bool = Field(False, description="Email verified status")
    created_at: datetime = Field(..., description="Account creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    last_login: Optional[datetime] = Field(None, description="Last login timestamp")
    default_currency: Optional[str] = Field(None, description="Default currency code")
    travel_style: Optional[str] = Field(None, description="Travel style preference")
    food_preference: Optional[str] = Field(None, description="Food preference")
    preferred_activities: Optional[List[str]] = Field(default=[], description="Preferred activities")
    default_budget_range: Optional[str] = Field(None, description="Default budget range")


class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100, description="User's full name")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    profile_image: Optional[str] = Field(None, max_length=500, description="Profile image URL")


class PreferencesUpdate(BaseModel):
    default_currency: Optional[str] = Field(None, max_length=10, description="Default currency code")
    travel_style: Optional[str] = Field(None, max_length=50, description="Travel style preference")
    food_preference: Optional[str] = Field(None, max_length=100, description="Food preference")
    preferred_activities: Optional[List[str]] = Field(default=[], description="Preferred activities")
    default_budget_range: Optional[str] = Field(None, max_length=50, description="Default budget range")


class RegisterResponse(BaseModel):
    id: str
    full_name: str
    email: str
    created_at: datetime


class RegisterSuccessResponse(BaseModel):
    success: bool = True
    message: str = "User registered successfully"
    data: RegisterResponse


class LoginSuccessResponse(BaseModel):
    success: bool = True
    message: str = "Login successful"
    data: TokenResponse


class MessageResponse(BaseModel):
    success: bool = True
    message: str
