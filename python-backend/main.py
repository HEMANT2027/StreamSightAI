import uvicorn
from app.core.config import get_settings
from app.core.logging_config import setup_logging
from app import create_app

# Expose ASGI app at import time for Uvicorn
app = create_app()

def main():
    """Application entry point"""
    settings = get_settings()
    setup_logging()
    uvicorn.run(
        app,
        host=settings.host,
        port=settings.port,
        workers=1,
        loop="asyncio",
        access_log=True,
        log_level="info"
    )

if __name__ == "__main__":
    main()
