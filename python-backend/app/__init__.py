from fastapi import FastAPI
from app.core.config import get_settings
from app.middleware.cors import setup_cors
from app.api.routes import health, chat, stats
from app.core.logging_config import logger

def create_app() -> FastAPI:
    """Application factory"""
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        version=settings.version,
        description="Multimodal Chat API with AI capabilities"
    )
    
    # Setup middleware
    setup_cors(app)
    
    # Include routers
    app.include_router(health.router, tags=["health"])
    app.include_router(chat.router, prefix="/api/v1", tags=["chat"])
    app.include_router(stats.router, prefix="/api/v1", tags=["stats"])
    
    logger.info("🎬 Multimodal Chat API application created successfully")
    
    return app