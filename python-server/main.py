import os
import base64
import uuid
import logging
import time
from typing import Optional, List
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import PlainTextResponse
import google.generativeai as genai
from chromadb.utils import embedding_functions
from chromadb import PersistentClient
import uvicorn
from dotenv import load_dotenv
import asyncio
from concurrent.futures import ThreadPoolExecutor
import threading
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('chat_api.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# --- Global Thread Pool for CPU-bound tasks ---
executor = ThreadPoolExecutor(max_workers=4)

# --- NEW: Session Cache for Storing Video Content ---
# This dictionary will hold the state (video content and MIME type) for each session.
VIDEO_CACHE = {}
cache_lock = threading.Lock()

# --- API Key Manager (No changes needed) ---
class APIKeyManager:
    def __init__(self):
        self.api_keys = []
        self.current_key_index = 0
        self.key_usage_count = {}
        self.key_last_error = {}
        self.lock = threading.Lock()
        self._load_api_keys()
        if not self.api_keys:
            logger.error("No valid Gemini API keys found!")
            raise ValueError("No Gemini API keys available")
        logger.info(f"Initialized with {len(self.api_keys)} API keys")

    def _load_api_keys(self):
        primary_key = os.getenv("GEMINI_API_KEY") or os.getenv("gemini_api_key")
        if primary_key:
            self.api_keys.append(primary_key)
            self.key_usage_count[primary_key] = 0
        key_index = 2
        while True:
            key = os.getenv(f"GEMINI_API_KEY_{key_index}")
            if not key:
                break
            self.api_keys.append(key)
            self.key_usage_count[key] = 0
            key_index += 1
        logger.info(f"Loaded {len(self.api_keys)} API keys")

    def get_current_key(self):
        with self.lock:
            if not self.api_keys:
                raise ValueError("No API keys available")
            return self.api_keys[self.current_key_index]

    def rotate_key(self, failed_key=None):
        with self.lock:
            if failed_key:
                self.key_last_error[failed_key] = time.time()
                logger.warning(f"API key failed, rotating. Key ending with: ...{failed_key[-4:]}")
            self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
            new_key = self.api_keys[self.current_key_index]
            logger.info(f"Rotated to API key ending with: ...{new_key[-4:]}")
            return new_key

    def increment_usage(self, api_key):
        with self.lock:
            self.key_usage_count[api_key] = self.key_usage_count.get(api_key, 0) + 1

try:
    api_key_manager = APIKeyManager()
except Exception as e:
    logger.error(f"Failed to initialize API key manager: {e}")
    api_key_manager = None

# --- ChromaDB & Gemini Model Setup ---
client = PersistentClient(path="./chroma_db")
logger.info("ChromaDB client initialized")
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction

try:
    gemini_ef = GoogleGenerativeAiEmbeddingFunction(api_key=api_key_manager.get_current_key())
    chat_history_collection = client.get_or_create_collection(
        name="chat_history",
        embedding_function=gemini_ef
    )
    logger.info("ChromaDB collection created successfully")
except Exception as e:
    logger.error(f"Error creating ChromaDB collection: {e}")
    chat_history_collection = None

app = FastAPI(title="Multimodal Chat API")



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",       # Local dev
        "https://streamsightai.onrender.com"  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)



def initialize_gemini_model(api_key):
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        logger.info(f"Gemini model initialized with key ending: ...{api_key[-4:]}")
        return model
    except Exception as e:
        logger.error(f"Failed to initialize Gemini model: {e}")
        raise

try:
    if api_key_manager:
        model = initialize_gemini_model(api_key_manager.get_current_key())
    else:
        raise ValueError("API key manager not available")
except Exception as e:
    logger.error(f"Model initialization error: {e}")
    model = None

# --- RAG: Context History Retrieval (For text chat) ---
async def get_context_history_async(prompt: str, session_id: str) -> str:
    if not chat_history_collection:
        return ""
    try:
        loop = asyncio.get_event_loop()
        query_embedding = await loop.run_in_executor(executor, lambda: gemini_ef([prompt])[0])
        results = chat_history_collection.query(query_embeddings=[query_embedding], n_results=3, where={"session_id": session_id})
        context_history = ""
        if results['documents'] and results['documents'][0]:
            history_docs = reversed(results['documents'][0])
            context_history = "\n".join(history_docs)
        return context_history
    except Exception as e:
        logger.error(f"Error querying ChromaDB for history: {e}")
        return ""

# --- Generation & API Calls ---
async def generate_with_retry(content: List, max_retries=3):
    global model
    last_exception = None
    for attempt in range(max_retries):
        try:
            current_key = api_key_manager.get_current_key()
            logger.info(f"Attempt {attempt + 1}/{max_retries} with key ending: ...{current_key[-4:]}")
            response = model.generate_content(contents=content, generation_config=genai.GenerationConfig(max_output_tokens=300, temperature=0.7))
            api_key_manager.increment_usage(current_key)
            logger.info(f"Successfully generated response with key ending: ...{current_key[-4:]}")
            return response.text
        except Exception as e:
            logger.warning(f"Attempt {attempt + 1} failed: {str(e)}")
            last_exception = e
            if "quota" in str(e).lower() or "rate" in str(e).lower() or "limit" in str(e).lower():
                logger.warning("Rate limit detected, rotating API key.")
                new_key = api_key_manager.rotate_key(current_key)
                try:
                    model = initialize_gemini_model(new_key)
                except Exception as init_e:
                    logger.error(f"Failed to re-initialize model with new key: {init_e}")
                    continue
            else:
                await asyncio.sleep(1)
    logger.error(f"All {max_retries} attempts failed. Last error: {last_exception}")
    raise last_exception

@app.post("/infer")
async def unified_chat(
    prompt: str = Form(...),
    video_file: Optional[UploadFile] = File(None, alias="video"),
    session_id: Optional[str] = Form(None)
):
    start_time = time.time()
    if not api_key_manager or not model:
        raise HTTPException(status_code=500, detail="API service is not properly configured.")

    if not session_id:
        session_id = str(uuid.uuid4())
        logger.info(f"Generated new session ID: {session_id}")

    logger.info(f"Request for session: {session_id}. Prompt: '{prompt[:50]}...'")

    context_history = await get_context_history_async(prompt, session_id)
    system_prompt = (
        "You are an expert video analysis assistant. "
        "Use the provided video and chat history to answer the user's question accurately."
    )
    content_parts = [{"text": system_prompt}]
    video_data = None

    # --- MODIFIED: Caching Logic ---
    if video_file:
        logger.info(f"Processing new video file '{video_file.filename}' for direct upload.")
        video_content = await video_file.read()
        video_data = {
            "mime_type": video_file.content_type,
            "data": base64.b64encode(video_content).decode('utf-8')
        }
        # Cache the processed video data for the session
        with cache_lock:
            VIDEO_CACHE[session_id] = video_data
        logger.info(f"Cached video data for session {session_id}.")
    else:
        # If no video file, check the cache for this session
        with cache_lock:
            if session_id in VIDEO_CACHE:
                video_data = VIDEO_CACHE[session_id]
                logger.info(f"Retrieved video data from cache for session {session_id}.")
            else:
                 if any(word in prompt.lower() for word in ['video', 'clip', 'scene', 'this']):
                     logger.warning("Prompt seems to refer to a video, but none was provided or cached.")

    if video_data:
        content_parts.append({"inline_data": video_data})
    
    if context_history:
        content_parts.append({"text": f"--- CHAT HISTORY ---\n{context_history}\n--- END HISTORY ---"})
    
    content_parts.append({"text": f"USER QUESTION: {prompt}"})
    content = [{"role": "user", "parts": content_parts}]

    try:
        ai_response = await generate_with_retry(content)
        if chat_history_collection:
            asyncio.create_task(store_chat_history_async(prompt, ai_response, session_id))
        
        processing_time = time.time() - start_time
        logger.info(f"Request completed in {processing_time:.2f}s - Session: {session_id}")
        return PlainTextResponse(content=ai_response)
        
    except Exception as e:
        processing_time = time.time() - start_time
        logger.error(f"Request failed after {processing_time:.2f}s for session {session_id}. Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")

async def store_chat_history_async(prompt: str, ai_response: str, session_id: str):
    try:
        document_to_add = f"User: {prompt}\nAssistant: {ai_response}"
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            executor,
            lambda: chat_history_collection.add(documents=[document_to_add], metadatas=[{"session_id": session_id}], ids=[str(uuid.uuid4())])
        )
        logger.debug(f"Chat history stored for session {session_id}")
    except Exception as e:
        logger.error(f"Error storing chat history for session {session_id}: {e}")

@app.get("/")
def health_check():
    return {"status": "ok", "message": "Service is running"}

if __name__ == "__main__":
    logger.info("Starting Multimodal Chat API server")
    uvicorn.run(app, host="0.0.0.0", port=9000)