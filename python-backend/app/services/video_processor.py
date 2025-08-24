import cv2
import base64
import numpy as np
import tempfile
import os
import time
from typing import List, Dict, Any
from app.core.logging_config import logger
from app.core.exceptions import VideoProcessingError
from app.core.config import get_settings

class VideoProcessor:
    """Advanced video processing service"""
    
    def __init__(self):
        self.settings = get_settings()
    
    def extract_frames_optimized(
        self, 
        video_bytes: bytes, 
        fps: int = None, 
        max_frames: int = None
    ) -> List[Dict[str, Any]]:
        """Extract frames from video with optimization"""
        fps = fps or self.settings.target_fps
        max_frames = max_frames or self.settings.max_frames
        
        logger.info(f"🎬 Starting frame extraction, target fps: {fps}, max_frames: {max_frames}")
        start_time = time.time()
        
        try:
            # Try in-memory processing first
            nparr = np.frombuffer(video_bytes, np.uint8)
            cap = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if cap is None:
                return self._extract_from_video_file(video_bytes, fps, max_frames)
            else:
                return self._process_single_image(cap, start_time)
                
        except Exception as e:
            logger.error(f"❌ Frame extraction error: {e}")
            raise VideoProcessingError(f"Failed to extract frames: {e}")
    
    def _extract_from_video_file(
        self, 
        video_bytes: bytes, 
        fps: int, 
        max_frames: int
    ) -> List[Dict[str, Any]]:
        """Extract frames from video file"""
        logger.info("🔄 Using temp file method for video processing")
        
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
            tmp_file.write(video_bytes)
            tmp_path = tmp_file.name
        
        try:
            cap = cv2.VideoCapture(tmp_path)
            if not cap.isOpened():
                raise VideoProcessingError("Could not open video file")
            
            video_fps = cap.get(cv2.CAP_PROP_FPS)
            frames = []
            frame_interval = max(1, int(video_fps / fps)) if video_fps > 0 else 1
            frame_count = 0
            extracted_count = 0
            
            logger.info(f"📊 Video FPS: {video_fps}, frame_interval: {frame_interval}")
            
            while cap.isOpened() and extracted_count < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_count % frame_interval == 0:
                    processed_frame = self._optimize_frame(frame)
                    if processed_frame:
                        frames.append(processed_frame)
                        extracted_count += 1
                
                frame_count += 1
            
            cap.release()
            return frames
            
        finally:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
    
    def _process_single_image(self, image: np.ndarray, start_time: float) -> List[Dict[str, Any]]:
        """Process single image"""
        logger.info("🖼️ Processing single image")
        
        processed_frame = self._optimize_frame(image)
        if processed_frame:
            extraction_time = time.time() - start_time
            logger.info(f"✅ Processed single image in {extraction_time:.2f}s")
            return [processed_frame]
        return []
    
    def _optimize_frame(self, frame: np.ndarray) -> Dict[str, Any]:
        """Optimize frame for processing"""
        try:
            # Resize if too large
            height, width = frame.shape[:2]
            if max(height, width) > 800:
                scale = 800 / max(height, width)
                new_width = int(width * scale)
                new_height = int(height * scale)
                frame = cv2.resize(frame, (new_width, new_height))
            
            # Compress with JPEG
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
            is_success, buffer = cv2.imencode(".jpg", frame, encode_param)
            
            if is_success:
                return {
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": base64.b64encode(buffer).decode()
                    }
                }
        except Exception as e:
            logger.error(f"❌ Frame optimization error: {e}")
        
        return None

# Global instance
video_processor: VideoProcessor = None

def get_video_processor() -> VideoProcessor:
    """Get video processor instance"""
    global video_processor
    if video_processor is None:
        video_processor = VideoProcessor()
    return video_processor