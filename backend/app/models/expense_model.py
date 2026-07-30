from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field


class ExpenseModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    trip_id: str
    category: str
    description: str
    amount: float
    date: str
    currency: str = "INR"
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
