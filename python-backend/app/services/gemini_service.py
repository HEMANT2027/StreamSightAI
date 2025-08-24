import asyncio
import google.generativeai as genai
from typing import List, Dict, Any
from app.core.logging_config import logger
from app.core.exceptions import GeminiServiceError
from app.services.api_key_manager import get_api_key_manager

class GeminiService:
    """Gemini AI model service with retry logic"""
    
    def __init__(self):
        self.model = None
        self.api_key_manager = get_api_key_manager()
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize Gemini model"""
        try:
            current_key = self.api_key_manager.get_current_key()
            genai.configure(api_key=current_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            logger.info(f"🤖 Gemini model initialized with key ending: ...{current_key[-4:]}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize Gemini model: {e}")
            raise GeminiServiceError(f"Model initialization failed: {e}")
    
    async def generate_with_retry(self, content: List[Dict[str, Any]], max_retries: int = 3) -> str:
        """Generate response with retry logic and key rotation"""
        last_exception = None
        
        for attempt in range(max_retries):
            try:
                current_key = self.api_key_manager.get_current_key()
                logger.info(f"🎯 Attempt {attempt + 1}/{max_retries} with key ending: ...{current_key[-4:]}")
                
                response = self.model.generate_content(
                    contents=content,
                    generation_config=genai.GenerationConfig(
                        max_output_tokens=500,
                        temperature=0.7,
                        top_p=0.8,
                        top_k=40
                    )
                )
                
                self.api_key_manager.increment_usage(current_key)
                logger.info(f"✅ Successfully generated response")
                return response.text
                
            except Exception as e:
                logger.warning(f"⚠️ Attempt {attempt + 1} failed: {str(e)}")
                last_exception = e
                
                # Handle rate limits
                if any(keyword in str(e).lower() for keyword in ["quota", "rate", "limit"]):
                    logger.warning("🔄 Rate limit detected, rotating API key")
                    new_key = self.api_key_manager.rotate_key(current_key)
                    self._initialize_model()
                else:
                    await asyncio.sleep(2 ** attempt)
        
        logger.error(f"❌ All {max_retries} attempts failed")
        raise GeminiServiceError(f"Generation failed after {max_retries} attempts: {last_exception}")

# Global instance
gemini_service: GeminiService = None

def get_gemini_service() -> GeminiService:
    """Get Gemini service instance"""
    global gemini_service
    if gemini_service is None:
        gemini_service = GeminiService()
    return gemini_service