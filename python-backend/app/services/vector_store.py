import asyncio
import uuid
from concurrent.futures import ThreadPoolExecutor
from typing import Optional
from chromadb import PersistentClient
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
from app.core.config import get_settings
from app.core.logging_config import logger
from app.core.exceptions import VectorStoreError
from app.services.api_key_manager import get_api_key_manager

class VectorStoreService:
    """ChromaDB vector store service"""
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key_manager = get_api_key_manager()
        self.executor = ThreadPoolExecutor(max_workers=self.settings.max_workers)
        self.client = None
        self.collection = None
        self.embedding_function = None
        
        self._initialize_store()
    
    def _initialize_store(self):
        """Initialize ChromaDB store"""
        try:
            self.client = PersistentClient(path=self.settings.chroma_db_path)
            logger.info("🗄️ ChromaDB client initialized")
            
            # Create embedding function
            current_key = self.api_key_manager.get_current_key()
            self.embedding_function = GoogleGenerativeAiEmbeddingFunction(api_key=current_key)
            
            # Create collection
            self.collection = self.client.get_or_create_collection(
                name="chat_history",
                embedding_function=self.embedding_function
            )
            logger.info("✅ ChromaDB collection created successfully")
            
        except Exception as e:
            logger.error(f"❌ Error creating ChromaDB: {e}")
            raise VectorStoreError(f"Failed to initialize vector store: {e}")
    
    async def get_context_history(self, prompt: str, session_id: str) -> str:
        """Retrieve context history using vector similarity"""
        if not self.collection:
            logger.warning("⚠️ Collection not available")
            return ""
        
        try:
            logger.debug(f"🔍 Retrieving context for session: {session_id}")
            
            # Generate embedding for similarity search
            loop = asyncio.get_event_loop()
            query_embedding = await loop.run_in_executor(
                self.executor, 
                lambda: self.embedding_function([prompt])[0]
            )
            
            # Perform vector similarity search
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=3,
                where={"session_id": session_id}
            )
            
            # Build context from results
            context_history = ""
            if results['documents'] and results['documents'][0]:
                for doc in reversed(results['documents'][0][-2:]):
                    context_history += f"{doc}\n"
            
            logger.debug(f"📏 Context history length: {len(context_history)}")
            return context_history
            
        except Exception as e:
            logger.error(f"❌ Error querying ChromaDB: {e}")
            return ""
    
    async def store_chat_history(self, prompt: str, ai_response: str, session_id: str):
        """Store chat history in vector database"""
        if not self.collection:
            return
        
        try:
            logger.debug(f"💾 Storing chat history for session: {session_id}")
            
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(
                self.executor,
                lambda: self.collection.add(
                    documents=[f"User: {prompt}\nAssistant: {ai_response}"],
                    metadatas=[{"session_id": session_id}],
                    ids=[str(uuid.uuid4())]
                )
            )
            logger.debug("✅ Chat history stored successfully")
            
        except Exception as e:
            logger.error(f"❌ Error storing chat history: {e}")

# Global instance
vector_store: Optional[VectorStoreService] = None

def get_vector_store() -> Optional[VectorStoreService]:
    """Get vector store instance"""
    global vector_store
    if vector_store is None:
        try:
            vector_store = VectorStoreService()
        except Exception as e:
            logger.error(f"❌ Failed to initialize vector store: {e}")
            return None
    return vector_store