from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class AIConversation(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    conversation_id: str
    user_id: Optional[str] = None
    title: str = "New Travel Conversation"
    context: Dict[str, Any] = Field(default_factory=dict)
    message_count: int = 0
    status: str = "active"  # active, archived
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class AIMessage(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    conversation_id: str
    sender: str  # user, assistant, system
    content: str
    tokens_used: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class TripRequestDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    request_id: str
    user_id: Optional[str] = None
    destination: str
    duration_days: int
    travelers: str
    budget_level: str
    pace: str
    interests: List[str] = Field(default_factory=list)
    special_preferences: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class TripGenerationDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    generation_id: str
    request_id: str
    conversation_id: Optional[str] = None
    destination: str
    status: str  # pending, completed, failed
    model_used: str
    prompt_used: str
    raw_gemini_response: Optional[str] = None
    validated_output: Optional[Dict[str, Any]] = None
    latency_ms: float = 0.0
    error_message: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True


class PromptLogDocument(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    log_id: str
    action_type: str  # chat, trip_generation, regenerate
    prompt_text: str
    gemini_response_text: Optional[str] = None
    execution_time_ms: float = 0.0
    model_used: str
    status: str  # success, error, retried
    tokens_estimated: Optional[int] = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
