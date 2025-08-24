import time
import uuid
import asyncio
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from app.api.dependencies import (
    get_gemini_service_dep,
    get_video_processor_dep,
    get_vector_store_dep,
    get_cache_dep
)
from app.services.gemini_service import GeminiService
from app.services.video_processor import VideoProcessor
from app.services.vector_store import VectorStoreService
from app.utils.cache import InMemoryCache
from app.core.logging_config import logger

router = APIRouter()

@router.post("/infer")
async def unified_chat(
    prompt: str = Form(...),
    video_file: Optional[UploadFile] = File(None),
    session_id: Optional[str] = Form(...),
    gemini_service: GeminiService = Depends(get_gemini_service_dep),
    video_processor: VideoProcessor = Depends(get_video_processor_dep),
    vector_store: VectorStoreService = Depends(get_vector_store_dep),
    cache: InMemoryCache = Depends(get_cache_dep)
):
    """Main multimodal chat endpoint"""
    start_time = time.time()
    logger.info(f"🚀 New inference request - Session: {session_id}, Has video: {video_file is not None}")
    
    # Generate session ID if not provided
    if not session_id:
        session_id = str(uuid.uuid4())
        logger.info(f"🆔 Generated new session ID: {session_id}")

    # Check cache first
    cache_key = f"{session_id}_{hash(prompt) % 10000}"
    cached_context = cache.get(cache_key)
    
    # Get context history
    if cached_context:
        logger.debug("⚡ Context retrieved from cache")
        context_history = cached_context
    else:
        logger.info("🧠 Retrieving context from vector store...")
        context_history = await vector_store.get_context_history(prompt, session_id)
        cache.set(cache_key, context_history)
    
    # Process video if provided
    frames = []
    if video_file:
        logger.info(f"🎬 Processing multimodal input: {video_file.filename}")
        try:
            video_content = await video_file.read()
            frames = video_processor.extract_frames_optimized(video_content)
            
            if not frames:
                raise HTTPException(status_code=400, detail="Could not extract frames from video.")
            
            logger.info(f"✅ Successfully extracted {len(frames)} frames")
        except Exception as e:
            logger.error(f"❌ Video processing error: {e}")
            raise HTTPException(status_code=400, detail=f"Video processing failed: {e}")
    
    # Optimize context length
    if len(context_history) > 1000:
        context_history = context_history[-1000:]
        logger.debug("✂️ Context history optimized to 1000 characters")
    
    # Build the complete prompt with context
    prompt_with_history = f"{context_history}User: {prompt}" if context_history else prompt
    content = [{"role": "user", "parts": [{"text": prompt_with_history}] + frames}]

    try:
        logger.info("🤖 Generating AI response...")
        # Generate response using Gemini service
        ai_response = await gemini_service.generate_with_retry(content)
        
        # Store conversation history asynchronously
        asyncio.create_task(vector_store.store_chat_history(prompt, ai_response, session_id))

        processing_time = time.time() - start_time
        logger.info(f"🎉 Request completed successfully in {processing_time:.2f}s - Session: {session_id}")
        
        return PlainTextResponse(content=ai_response)
    
    except Exception as e:
        processing_time = time.time() - start_time
        logger.error(f"❌ Request failed after {processing_time:.2f}s - Error: {e}")
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {e}")