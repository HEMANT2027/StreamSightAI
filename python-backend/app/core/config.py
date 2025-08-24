import os
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    """Application settings"""
    
    # App settings
    app_name: str = "Multimodal Chat API"
    version: str = "1.0.0"
    host: str = "0.0.0.0"
    port: int = 9000
    
    # Database settings
    chroma_db_path: str = "./chroma_db"
    
    # API Keys
    gemini_api_key: str = Field(..., env="GEMINI_API_KEY")
    
    # Performance settings
    max_workers: int = 4
    cache_size_limit: int = 100
    max_frames: int = 5
    target_fps: int = 1
    
    # CORS settings
    allowed_origins: list = ["http://localhost:5173"]
    
    class Config:
        env_file = ".env"

# Global settings instance
_settings = None

def get_settings() -> Settings:
    """Get application settings (singleton pattern)"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings