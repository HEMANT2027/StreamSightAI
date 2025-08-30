import axios from 'axios';

// Base URL for your backend API
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout for video processing
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making API request to: ${config.url}`);
    if (config.data instanceof FormData) {
      console.log('📋 FormData contents:');
      for (let [key, value] of config.data.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`  ${key}: ${value}`);
        }
      }
    }
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response received:', typeof response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Generate a unique session ID
 * @returns {string}
 */
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

/**
 * Send a message to the chatbot with optional video file
 * @param {string} prompt - The user's message/prompt
 * @param {File|null} videoFile - Optional video file for analysis
 * @param {string|null} sessionId - Session ID for maintaining conversation context
 * @returns {Promise<{response: string, sessionId: string}>}
 */
export const sendMessage = async (prompt, videoFile = null, sessionId = null) => {
  try {
    console.log('🎯 sendMessage called:', { 
      prompt: prompt.substring(0, 50) + '...', 
      hasVideo: !!videoFile, 
      sessionId 
    });

    // Create session ID if not provided
    const currentSessionId = sessionId || generateSessionId();
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('session_id', currentSessionId); // Always send session_id
    
    // ⚠️ CRITICAL FIX: Use 'video_file' instead of 'video' to match backend
    if (videoFile) {
      formData.append('video_file', videoFile); // Changed from 'video' to 'video_file'
      console.log('📎 Video file attached:', videoFile.name, videoFile.size, 'bytes');
    }

    // Don't set Content-Type header explicitly - let axios handle it
    const response = await api.post('/api/v1/infer', formData);

    console.log('✅ API Response successful');

    // ⚠️ CRITICAL FIX: Your backend returns PlainTextResponse, not JSON
    const responseText = typeof response.data === 'string' 
      ? response.data 
      : JSON.stringify(response.data);

    return {
      response: responseText,
      sessionId: currentSessionId,
    };
  } catch (error) {
    console.error('❌ Error sending message:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data || 'Server error';
      throw new Error(`Request failed (${status}): ${message}`);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      throw new Error('Request timeout. Please try again.');
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other errors
      throw new Error(`An unexpected error occurred: ${error.message}`);
    }
  }
};

/**
 * Check if the backend server is running
 * @returns {Promise<boolean>}
 */
export const checkServerHealth = async () => {
  try {
    console.log('💚 Checking server health...');
    const response = await api.get('/', { timeout: 5000 });
    console.log('✅ Server health check passed:', response.data);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('❌ Health check failed:', error);
    return false;
  }
};

/**
 * Validate video file before upload
 * @param {File} file - The video file to validate
 * @returns {Object} - {isValid: boolean, error: string|null}
 */
export const validateVideoFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  // Check file size (limit to 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'File size too large. Please upload a video smaller than 100MB.' 
    };
  }

  // Basic file type check
  const fileName = file.name.toLowerCase();
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'];
  const hasVideoExtension = videoExtensions.some(ext => fileName.endsWith(ext)) || 
                           file.type.startsWith('video/');
  
  if (!hasVideoExtension) {
    return { 
      isValid: false, 
      error: 'Please upload a video file (mp4, avi, mov, wmv, flv, webm, mkv, m4v)' 
    };
  }

  console.log('✅ Video file validation passed:', {
    name: file.name,
    size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    type: file.type
  });

  return { isValid: true, error: null };
};

export default api;