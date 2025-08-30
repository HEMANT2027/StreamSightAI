import os
import time
import threading
from typing import List, Dict, Optional
from app.core.logging_config import logger
from app.core.exceptions import APIKeyManagerError

class APIKeyManager:
    """Intelligent API Key Rotation System"""
    
    def __init__(self):
        self.api_keys: List[str] = []
        self.current_key_index = 0
        self.key_usage_count: Dict[str, int] = {}
        self.key_last_error: Dict[str, float] = {}
        self.lock = threading.Lock()
        
        self._load_api_keys()
        
        if not self.api_keys:
            logger.error("No valid Gemini API keys found!")
            raise APIKeyManagerError("No Gemini API keys available")
        
        logger.info(f"🎉 Initialized with {len(self.api_keys)} API keys")
    
    def _load_api_keys(self):
        """Load all available API keys from environment"""
        # Load primary key
        primary_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
        if primary_key:
            self.api_keys.append(primary_key)
            self.key_usage_count[primary_key] = 0
        
        # Load additional keys
        key_index = 2
        while True:
            key = os.getenv(f"GEMINI_API_KEY_{key_index}")
            if not key:
                break
            self.api_keys.append(key)
            self.key_usage_count[key] = 0
            key_index += 1
    
    def get_current_key(self) -> str:
        """Get the currently active API key"""
        with self.lock:
            if not self.api_keys:
                raise APIKeyManagerError("No API keys available")
            return self.api_keys[self.current_key_index]
    
    def rotate_key(self, failed_key: Optional[str] = None) -> str:
        """Rotate to the next available API key"""
        with self.lock:
            if failed_key:
                self.key_last_error[failed_key] = time.time()
                logger.warning(f"🔄 API key failed, rotating. Key ending with: ...{failed_key[-4:]}")
            
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
            new_key = self.api_keys[self.current_key_index]
            logger.info(f"✅ Rotated to API key ending with: ...{new_key[-4:]}")
            return new_key
    
    def increment_usage(self, api_key: str):
        """Track API key usage"""
        with self.lock:
            self.key_usage_count[api_key] = self.key_usage_count.get(api_key, 0) + 1
    
    def get_stats(self) -> Dict:
        """Get API key usage statistics"""
        with self.lock:
            stats = {}
            for i, key in enumerate(self.api_keys):
                key_suffix = f"...{key[-4:]}"
                stats[f"key_{i+1}_{key_suffix}"] = {
                    "usage_count": self.key_usage_count.get(key, 0),
                    "last_error": self.key_last_error.get(key),
                    "is_current": i == self.current_key_index
                }
            return stats

# Global instance
api_key_manager: Optional[APIKeyManager] = None

def get_api_key_manager() -> APIKeyManager:
    """Get API key manager instance"""
    global api_key_manager
    if api_key_manager is None:
        api_key_manager = APIKeyManager()
    return api_key_manager