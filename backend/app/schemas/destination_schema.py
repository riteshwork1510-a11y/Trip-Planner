from typing import Optional, List
from pydantic import BaseModel


class DestinationCreate(BaseModel):
    name: str
    country: str
    description: str
    image: Optional[str] = None
    best_season: Optional[str] = None
    avg_duration: Optional[str] = None
    rating: float = 4.5
    categories: List[str] = []


class DestinationUpdate(BaseModel):
    name: Optional[str] = None
    country: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    best_season: Optional[str] = None
    avg_duration: Optional[str] = None
    rating: Optional[float] = None
    categories: Optional[List[str]] = None
