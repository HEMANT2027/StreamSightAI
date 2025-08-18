import os
import io
import base64
import cv2
import uuid
import logging
import time
from typing import Optional, List, Dict
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel
import google.generativeai as genai
from chromadb.utils import embedding_functions
from chromadb import PersistentClient
import numpy as np
import uvicorn
from dotenv import load_dotenv
import asyncio
from concurrent.futures import ThreadPoolExecutor
import tempfile
import threading
from itertools import cycle
import random

# ==============================================================================
# 🚀 DEMO POINT 1: Environment Setup and Configuration Loading
# ==============================================================================
# This loads our API keys and configuration from .env file
# Perfect for demo: "First, we load our environment variables securely"
load_dotenv()

# ==============================================================================
# 📋 DEMO POINT 2: Comprehensive Logging System
# ==============================================================================
# Professional logging setup with both file and console output
# Demo explanation: "We implement enterprise-grade logging for monitoring and debugging"
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('chat_api.log'),  # File logging for persistence
        logging.StreamHandler()               # Console logging for real-time monitoring
    ]
)
logger = logging.getLogger(__name__)

# ==============================================================================
# ⚡ DEMO POINT 3: Performance Optimization with Thread Pool
# ==============================================================================
# Global thread pool for CPU-intensive tasks like video processing
# Demo: "We use async processing to handle multiple requests efficiently"
executor = ThreadPoolExecutor(max_workers=4)

# ==============================================================================
# 🔑 DEMO POINT 4: Smart API Key Management System
# ==============================================================================
class APIKeyManager:
    """
    🎯 DEMO HIGHLIGHT: Intelligent API Key Rotation System
    
    This class manages multiple Gemini API keys to:
    - Prevent rate limiting by rotating keys
    - Track usage statistics for each key
    - Automatically failover when a key hits limits
    - Maintain high availability for the service
    """
    
    def __init__(self):
        # Key storage and rotation management
        self.api_keys = []
        self.current_key_index = 0
        self.key_usage_count = {}      # Track how many times each key is used
        self.key_last_error = {}       # Track when each key last failed
        self.lock = threading.Lock()   # Thread-safe operations
        
        # Load all available API keys from environment
        self._load_api_keys()
        
        if not self.api_keys:
            logger.error("No valid Gemini API keys found!")
            raise ValueError("No Gemini API keys available")
        
        logger.info(f"🎉 Initialized with {len(self.api_keys)} API keys for high availability")
    
    def _load_api_keys(self):
        """
        🔍 DEMO EXPLANATION: Dynamic API Key Discovery
        Automatically discovers and loads all available API keys from environment
        """
        # Load primary key (GEMINI_API_KEY or gemini_api_key)
        primary_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
        if primary_key:
            self.api_keys.append(primary_key)
            self.key_usage_count[primary_key] = 0
        
        # Load additional keys (GEMINI_API_KEY_2, GEMINI_API_KEY_3, etc.)
        key_index = 2
        while True:
            key = os.getenv(f"GEMINI_API_KEY_{key_index}")
            if not key:
                break
            self.api_keys.append(key)
            self.key_usage_count[key] = 0
            key_index += 1
            
        logger.info(f"📊 Loaded {len(self.api_keys)} API keys for rotation")
    
    def get_current_key(self):
        """Get the currently active API key"""
        with self.lock:
            if not self.api_keys:
                raise ValueError("No API keys available")
            return self.api_keys[self.current_key_index]
    
    def rotate_key(self, failed_key=None):
        """
        🔄 DEMO HIGHLIGHT: Intelligent Key Rotation
        When a key fails, we immediately rotate to the next available key
        """
        with self.lock:
            if failed_key:
                self.key_last_error[failed_key] = time.time()
                logger.warning(f"🔄 API key failed, rotating. Key ending with: ...{failed_key[-4:]}")
            
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
            new_key = self.api_keys[self.current_key_index]
            logger.info(f"✅ Rotated to API key ending with: ...{new_key[-4:]}")
            return new_key
    
    def increment_usage(self, api_key):
        """Track API key usage for monitoring and analytics"""
        with self.lock:
            self.key_usage_count[api_key] = self.key_usage_count.get(api_key, 0) + 1
    
    def get_stats(self):
        """
        📈 DEMO FEATURE: Real-time API Key Analytics
        Provides detailed statistics about key usage and health
        """
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

# ==============================================================================
# 🎯 DEMO POINT 5: API Key Manager Initialization
# ==============================================================================
# Initialize our smart API key management system
try:
    api_key_manager = APIKeyManager()
    logger.info("✅ API Key Manager initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize API key manager: {e}")
    api_key_manager = None

# ==============================================================================
# 🗄️ DEMO POINT 6: Vector Database Setup with ChromaDB
# ==============================================================================
# ChromaDB provides persistent vector storage for chat history and context retrieval
# Demo: "We use ChromaDB for intelligent context-aware conversations"
client = PersistentClient(path="./chroma_db")
logger.info("🗄️ ChromaDB client initialized for persistent vector storage")

from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction

try:
    # Create embedding function using Gemini for consistent vector representation
    gemini_ef = GoogleGenerativeAiEmbeddingFunction(api_key=api_key_manager.get_current_key())
    
    # Create or get the chat history collection
    chat_history_collection = client.get_or_create_collection(
        name="chat_history",
        embedding_function=gemini_ef
    )
    logger.info("✅ ChromaDB collection created successfully")
except Exception as e:
    logger.error(f"❌ Error creating ChromaDB collection: {e}")
    chat_history_collection = None

# ==============================================================================
# 🌐 DEMO POINT 7: FastAPI Application Setup
# ==============================================================================
# FastAPI provides high-performance async web framework for our API
app = FastAPI(title="Multimodal Chat API")
logger.info("🌐 FastAPI application initialized")

# ==============================================================================
# 🤖 DEMO POINT 8: Gemini AI Model Initialization
# ==============================================================================
def initialize_gemini_model(api_key):
    """
    🧠 DEMO EXPLANATION: AI Model Setup
    Initialize Google's Gemini 2.0 Flash model for multimodal understanding
    """
    try:
        genai.configure(api_key=api_key)
        # Using Gemini 2.0 Flash for optimal speed and multimodal capabilities
        model = genai.GenerativeModel('gemini-2.0-flash')
        logger.info(f"🤖 Gemini model initialized with key ending: ...{api_key[-4:]}")
        return model
    except Exception as e:
        logger.error(f"❌ Failed to initialize Gemini model: {e}")
        raise

# Initialize the AI model
try:
    if api_key_manager:
        model = initialize_gemini_model(api_key_manager.get_current_key())
        logger.info("✅ AI Model ready for multimodal processing")
    else:
        raise ValueError("API key manager not available")
except Exception as e:
    logger.error(f"❌ Model initialization error: {e}")
    model = None

# ==============================================================================
# 💾 DEMO POINT 9: Intelligent Caching System
# ==============================================================================
# In-memory cache for embedding results to improve performance
# Demo: "We implement smart caching to reduce response times"
embedding_cache = {}
cache_lock = threading.Lock()

def extract_frames_optimized(video_bytes: bytes, fps: int = 1, max_frames: int = 10):
    """
    🎬 DEMO HIGHLIGHT: Advanced Video Processing Pipeline
    
    This function showcases our video processing capabilities:
    - Optimized memory usage for large video files
    - Intelligent frame extraction with configurable FPS
    - Automatic image resizing for faster processing
    - Fallback mechanisms for different video formats
    """
    logger.info(f"🎬 Starting frame extraction, target fps: {fps}, max_frames: {max_frames}")
    start_time = time.time()
    
    # Try in-memory processing first (faster for images)
    nparr = np.frombuffer(video_bytes, np.uint8)
    cap = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if cap is None:
        # Fallback to temporary file method for video streams
        logger.info("🔄 Using fallback temp file method for video processing")
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
            tmp_file.write(video_bytes)
            tmp_path = tmp_file.name
        
        cap = cv2.VideoCapture(tmp_path)
        if not cap.isOpened():
            os.unlink(tmp_path)
            logger.error("❌ Could not open video file")
            raise ValueError("Could not open video file.")
        
        # Extract video properties for intelligent frame selection
        video_fps = cap.get(cv2.CAP_PROP_FPS)
        frames = []
        
        frame_interval = max(1, int(video_fps / fps)) if video_fps > 0 else 1
        frame_count = 0
        extracted_count = 0
        
        logger.info(f"📊 Video FPS: {video_fps}, frame_interval: {frame_interval}")
        
        # Intelligent frame extraction loop
        while cap.isOpened() and extracted_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Extract frames at specified intervals
            if frame_count % frame_interval == 0:
                # Optimize frame size for faster processing
                height, width = frame.shape[:2]
                if max(height, width) > 800:
                    scale = 800 / max(height, width)
                    new_width = int(width * scale)
                    new_height = int(height * scale)
                    frame = cv2.resize(frame, (new_width, new_height))
                
                # Compress with optimized JPEG settings
                encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
                is_success, buffer = cv2.imencode(".jpg", frame, encode_param)
                if is_success:
                    frames.append({
                        "inline_data": {
                            "mime_type": "image/jpeg",
                            "data": base64.b64encode(buffer).decode()
                        }
                    })
                    extracted_count += 1
            
            frame_count += 1
        
        cap.release()
        os.unlink(tmp_path)
        
        extraction_time = time.time() - start_time
        logger.info(f"✅ Extracted {extracted_count} frames in {extraction_time:.2f}s")
        return frames
    else:
        # Handle single image case
        logger.info("🖼️ Processing single image")
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
        is_success, buffer = cv2.imencode(".jpg", cap, encode_param)
        if is_success:
            extraction_time = time.time() - start_time
            logger.info(f"✅ Processed single image in {extraction_time:.2f}s")
            return [{
                "inline_data": {
                    "mime_type": "image/jpeg",
                    "data": base64.b64encode(buffer).decode()
                }
            }]
        return []

async def get_context_history_async(prompt: str, session_id: str) -> str:
    """
    🧠 DEMO HIGHLIGHT: Intelligent Context Retrieval System
    
    This function demonstrates our smart conversation memory:
    - Vector-based similarity search for relevant context
    - Session-based conversation threading
    - Intelligent caching for performance
    - Asynchronous processing for scalability
    """
    if not chat_history_collection:
        logger.warning("⚠️ Chat history collection not available")
        return ""
    
    logger.debug(f"🔍 Retrieving context for session: {session_id}")
    
    # Check our intelligent cache first
    cache_key = f"{session_id}_{hash(prompt) % 10000}"
    with cache_lock:
        if cache_key in embedding_cache:
            logger.debug("⚡ Context retrieved from cache")
            return embedding_cache[cache_key]
    
    try:
        # Generate embedding for similarity search
        loop = asyncio.get_event_loop()
        query_embedding = await loop.run_in_executor(executor, lambda: gemini_ef([prompt])[0])
        
        # Perform vector similarity search
        results = chat_history_collection.query(
            query_embeddings=[query_embedding],
            n_results=3,  # Optimized for speed while maintaining context quality
            where={"session_id": session_id}
        )
        
        # Build context from most relevant conversations
        context_history = ""
        if results['documents'] and results['documents'][0]:
            for doc in reversed(results['documents'][0][-2:]):  # Last 2 most relevant
                context_history += f"{doc}\n"
        
        # Cache the result for future requests
        with cache_lock:
            if len(embedding_cache) > 100:  # Prevent memory overflow
                embedding_cache.clear()
            embedding_cache[cache_key] = context_history
        
        logger.debug(f"📏 Context history length: {len(context_history)}")
        return context_history
    except Exception as e:
        logger.error(f"❌ Error querying ChromaDB: {e}")
        return ""

async def generate_with_retry(content, max_retries=3):
    """
    🔄 DEMO HIGHLIGHT: Robust AI Generation with Smart Retry Logic
    
    This function showcases our resilience features:
    - Automatic retry with exponential backoff
    - Smart API key rotation on rate limits
    - Model re-initialization on failures
    - Comprehensive error handling
    """
    global model
    last_exception = None
    
    for attempt in range(max_retries):
        try:
            current_key = api_key_manager.get_current_key()
            logger.info(f"🎯 Attempt {attempt + 1}/{max_retries} with key ending: ...{current_key[-4:]}")
            
            # Generate response with optimized parameters
            response = model.generate_content(
                contents=content,
                generation_config=genai.GenerationConfig(
                    max_output_tokens=500,  # Balanced for speed and quality
                    temperature=0.7,        # Creative but focused responses
                    top_p=0.8,             # Nucleus sampling for quality
                    top_k=40               # Token diversity control
                )
            )
            
            # Success! Track usage and return
            api_key_manager.increment_usage(current_key)
            logger.info(f"✅ Successfully generated response with key ending: ...{current_key[-4:]}")
            return response.text
            
        except Exception as e:
            logger.warning(f"⚠️ Attempt {attempt + 1} failed: {str(e)}")
            last_exception = e
            
            # Intelligent error handling - check for rate limits
            if "quota" in str(e).lower() or "rate" in str(e).lower() or "limit" in str(e).lower():
                logger.warning("🔄 Rate limit detected, rotating API key")
                new_key = api_key_manager.rotate_key(current_key)
                
                # Re-initialize model with new key
                try:
                    model = initialize_gemini_model(new_key)
                    logger.info("✅ Model re-initialized with new key")
                except Exception as init_e:
                    logger.error(f"❌ Failed to re-initialize model: {init_e}")
                    continue
            else:
                # Exponential backoff for other errors
                await asyncio.sleep(2 ** attempt)
    
    # All retries exhausted
    logger.error(f"❌ All {max_retries} attempts failed. Last error: {last_exception}")
    raise last_exception

# ==============================================================================
# 🌐 DEMO POINT 10: API Endpoints
# ==============================================================================

@app.get("/")
def health_check():
    """
    💚 DEMO ENDPOINT: Health Check
    Simple endpoint to verify service availability
    """
    logger.info("💚 Health check requested")
    return {"status": "ok", "message": "Service is running"}

@app.get("/stats")
def get_api_stats():
    """
    📊 DEMO ENDPOINT: Real-time Analytics Dashboard
    Provides insights into API key usage and system performance
    """
    logger.info("📊 API stats requested")
    if api_key_manager:
        stats = api_key_manager.get_stats()
        return {"api_key_stats": stats, "cache_size": len(embedding_cache)}
    else:
        return {"error": "API key manager not available"}

@app.post("/infer")
async def unified_chat(
    prompt: str = Form(...),
    video_file: Optional[UploadFile] = File(None),
    session_id: Optional[str] = Form(None)
):
    """
    🚀 DEMO HIGHLIGHT: Main Multimodal Chat Endpoint
    
    This is our flagship endpoint that demonstrates:
    ✨ Multimodal input processing (text + video/images)
    🧠 Context-aware conversations with memory
    ⚡ High-performance async processing
    🔄 Automatic failover and retry logic
    📊 Comprehensive logging and monitoring
    """
    start_time = time.time()
    logger.info(f"🚀 New inference request - Session: {session_id}, Has video: {video_file is not None}")
    
    # Validate system availability
    if not api_key_manager:
        logger.error("❌ API key manager not available")
        raise HTTPException(status_code=500, detail="API key manager is not available.")

    # Generate session ID if not provided
    if not session_id:
        session_id = str(uuid.uuid4())
        logger.info(f"🆔 Generated new session ID: {session_id}")

    # Start context retrieval asynchronously for better performance
    logger.info("🧠 Starting intelligent context retrieval...")
    context_task = asyncio.create_task(get_context_history_async(prompt, session_id))
    
    # Process video/image if provided
    frames = []
    if video_file:
        logger.info(f"🎬 Processing multimodal input: {video_file.filename}, size: {video_file.size} bytes")
        
        # Read and process video content asynchronously
        video_content = await video_file.read()
        
        # Extract frames using our optimized processing pipeline
        loop = asyncio.get_event_loop()
        try:
            frames = await loop.run_in_executor(
                executor, 
                extract_frames_optimized, 
                video_content, 
                1,  # fps - optimized for quality vs speed
                5   # max_frames - balanced for performance
            )
        except Exception as e:
            logger.error(f"❌ Frame extraction error: {e}")
            frames = []

        if not frames:
            logger.error("❌ Could not extract frames from video")
            raise HTTPException(status_code=400, detail="Could not extract frames from video.")
        
        logger.info(f"✅ Successfully extracted {len(frames)} frames for AI analysis")
    
    # Wait for context retrieval to complete
    logger.info("⏳ Waiting for context retrieval...")
    context_history = await context_task
    
    # Optimize context length for better performance
    if len(context_history) > 1000:
        context_history = context_history[-1000:]
        logger.debug("✂️ Context history optimized to 1000 characters")
    
    # Build the complete prompt with context
    prompt_with_history = f"{context_history}User: {prompt}" if context_history else prompt
    content = [{"role": "user", "parts": [{"text": prompt_with_history}] + frames}]

    try:
        logger.info("🤖 Generating AI response with retry logic...")
        # Generate response using our robust retry system
        ai_response = await generate_with_retry(content)
        
        # Store conversation history asynchronously (non-blocking)
        if chat_history_collection:
            logger.info("💾 Storing conversation in vector database...")
            asyncio.create_task(store_chat_history_async(prompt, ai_response, session_id))

        processing_time = time.time() - start_time
        logger.info(f"🎉 Request completed successfully in {processing_time:.2f}s - Session: {session_id}")
        
        return PlainTextResponse(content=ai_response)
    
    except Exception as e:
        processing_time = time.time() - start_time
        logger.error(f"❌ Request failed after {processing_time:.2f}s - Error: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {e}")

async def store_chat_history_async(prompt: str, ai_response: str, session_id: str):
    """
    💾 DEMO FEATURE: Asynchronous Chat History Storage
    
    Stores conversation context in vector database for future context retrieval
    - Non-blocking operation for better response times
    - Vector embeddings for semantic search
    - Session-based organization
    """
    try:
        logger.debug(f"💾 Storing chat history for session: {session_id}")
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            executor,
            lambda: chat_history_collection.add(
                documents=[f"User: {prompt}\nAssistant: {ai_response}"],
                metadatas=[{"session_id": session_id}],
                ids=[str(uuid.uuid4())]
            )
        )
        logger.debug("✅ Chat history stored successfully")
    except Exception as e:
        logger.error(f"❌ Error storing chat history: {e}")

# ==============================================================================
# 🎬 DEMO POINT 11: Application Launch
# ==============================================================================
# Main application entry point with optimized server configuration
if __name__ == "__main__":
    logger.info("🎬 Starting Multimodal Chat API server...")
    logger.info("🔧 Server Configuration:")
    logger.info("   - Host: localhost")
    logger.info("   - Port: 9000")
    logger.info("   - Workers: 1 (optimized for async processing)")
    logger.info("   - Event Loop: asyncio")
    logger.info("   - Access Logging: Enabled")
    
    uvicorn.run(
        app, 
        host="localhost", 
        port=9000,
        workers=1,           # Single worker optimized for async processing
        loop="asyncio",      # Async event loop for best performance
        access_log=True,     # Enable detailed access logging
        log_level="info"     # Comprehensive logging level
    )