from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.core.logging_config import logger

router = APIRouter()

@router.get("/", response_model=HealthResponse)
@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint"""
    logger.info("💚 Health check requested")
    return HealthResponse(status="ok", message="Service is running")