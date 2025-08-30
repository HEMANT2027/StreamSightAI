from fastapi import Depends, HTTPException
from app.services.api_key_manager import get_api_key_manager, APIKeyManager
from app.services.gemini_service import get_gemini_service, GeminiService
from app.services.video_processor import get_video_processor, VideoProcessor
from app.services.vector_store import get_vector_store, VectorStoreService
from app.utils.cache import get_cache, InMemoryCache

def get_api_key_manager_dep() -> APIKeyManager:
    """Dependency to get API key manager"""
    try:
        return get_api_key_manager()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API key manager unavailable: {e}")

def get_gemini_service_dep() -> GeminiService:
    """Dependency to get Gemini service"""
    try:
        return get_gemini_service()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini service unavailable: {e}")

def get_video_processor_dep() -> VideoProcessor:
    """Dependency to get video processor"""
    return get_video_processor()

def get_vector_store_dep() -> VectorStoreService:
    """Dependency to get vector store"""
    store = get_vector_store()
    if store is None:
        raise HTTPException(status_code=500, detail="Vector store unavailable")
    return store

def get_cache_dep() -> InMemoryCache:
    """Dependency to get cache"""
    return get_cache()