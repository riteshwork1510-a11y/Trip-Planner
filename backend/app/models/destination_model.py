from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field


class DestinationModel(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    name: str
    country: str
    description: str
    image: Optional[str] = None
    best_season: Optional[str] = None
    avg_duration: Optional[str] = None
    rating: float = 4.5
    categories: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
