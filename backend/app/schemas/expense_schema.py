from typing import Optional
from pydantic import BaseModel


class ExpenseCreate(BaseModel):
    trip_id: str
    category: str
    description: str
    amount: float
    date: str
    currency: str = "INR"
    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):
    category: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = None
    date: Optional[str] = None
    currency: Optional[str] = None
    notes: Optional[str] = None
