import threading
from typing import Dict, Any, Optional
from app.core.config import get_settings

class InMemoryCache:
    """In-memory cache with size limit"""
    
    def __init__(self):
        self.settings = get_settings()
        self.cache: Dict[str, Any] = {}
        self.lock = threading.Lock()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        with self.lock:
            return self.cache.get(key)
    
    def set(self, key: str, value: Any):
        """Set value in cache with size limit"""
        with self.lock:
            if len(self.cache) >= self.settings.cache_size_limit:
                # Remove oldest entries (simple FIFO)
                oldest_key = next(iter(self.cache))
                del self.cache[oldest_key]
            
            self.cache[key] = value
    
    def clear(self):
        """Clear cache"""
        with self.lock:
            self.cache.clear()
    
    def size(self) -> int:
        """Get cache size"""
        with self.lock:
            return len(self.cache)

# Global cache instance
cache = InMemoryCache()

def get_cache() -> InMemoryCache:
    """Get cache instance"""
    return cache