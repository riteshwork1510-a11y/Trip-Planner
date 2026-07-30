from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, EmailStr


class UserRegister(BaseModel):
    full_name: str = Field(..., min_length=1, max_length=100, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., min_length=8, max_length=128, description="User password")
    phone_number: Optional[str] = Field(None, max_length=20, description="Phone number")
    default_currency: Optional[str] = Field(None, max_length=10, description="Default currency code")
    travel_style: Optional[str] = Field(None, max_length=50, description="Travel style preference")
    food_preference: Optional[str] = Field(None, max_length=100, description="Food preference")


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str = Field(..., description="User password")


class ChangePassword(BaseModel):
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, max_length=128, description="New password")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: Optional[str] = Field(None, description="Refresh token")
