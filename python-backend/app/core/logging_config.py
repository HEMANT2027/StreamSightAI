import logging
import sys
from pathlib import Path

def setup_logging():
    """Setup application logging"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('chat_api.log'),
            logging.StreamHandler(sys.stdout)
        ]
    )

# Global logger instance
logger = logging.getLogger(__name__)