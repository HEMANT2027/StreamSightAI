from fastapi import APIRouter, Depends
from app.models.schemas import StatsResponse
from app.api.dependencies import get_api_key_manager_dep, get_cache_dep
from app.services.api_key_manager import APIKeyManager
from app.utils.cache import InMemoryCache
from app.core.logging_config import logger

router = APIRouter()

@router.get("/stats", response_model=StatsResponse)
def get_api_stats(
    api_key_manager: APIKeyManager = Depends(get_api_key_manager_dep),
    cache: InMemoryCache = Depends(get_cache_dep)
):
    """Get API statistics"""
    logger.info("📊 API stats requested")
    
    stats = api_key_manager.get_stats()
    return StatsResponse(
        api_key_stats=stats,
        cache_size=cache.size()
    )