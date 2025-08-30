from pydantic import BaseModel
from typing import Optional, Dict, Any

class ChatRequest(BaseModel):
    """Chat request model"""
    prompt: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    """Chat response model"""
    response: str
    session_id: str
    processing_time: float

class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    message: str

class StatsResponse(BaseModel):
    """Stats response model"""
    api_key_stats: Dict[str, Any]
    cache_size: int