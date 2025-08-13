import axios from 'axios';

// Base URL for your backend API
const BASE_URL = 'https://streamsightai.onrender.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout for video processing
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Send a message to the chatbot with optional video file
 * @param {string} prompt - The user's message/prompt
 * @param {File|null} videoFile - Optional video file for analysis
 * @param {string|null} sessionId - Session ID for maintaining conversation context
 * @returns {Promise<{response: string, sessionId: string}>}
 */
export const sendMessage = async (prompt, videoFile = null, sessionId = null) => {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    
    if (videoFile) {
      formData.append('video', videoFile);
    }
    
    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const response = await api.post('/infer', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      response: response.data,
      sessionId: sessionId || generateSessionId(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.detail || error.response.data || 'Server error';
      throw new Error(`Request failed: ${message}`);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      throw new Error('Request timeout. Please try again.');
    } else if (error.request) {
      // Network error
      throw new Error('Network error. Please check your connection.');
    } else {
      // Other errors
      throw new Error('An unexpected error occurred.');
    }
  }
};

/**
 * Check if the backend server is running
 * @returns {Promise<boolean>}
 */
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/', { timeout: 5000 });
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Generate a unique session ID
 * @returns {string}
 */
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
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

  // Basic file type check - accept any file type
  const fileName = file.name.toLowerCase();
  const hasVideoExtension = fileName.includes('.mp4') || fileName.includes('.avi') || 
                           fileName.includes('.mov') || fileName.includes('.wmv') || 
                           fileName.includes('.flv') || fileName.includes('.webm') || 
                           fileName.includes('.mkv') || file.type.startsWith('video/');
  
  if (!hasVideoExtension) {
    return { 
      isValid: false, 
      error: 'Please upload a video file' 
    };
  }

  return { isValid: true, error: null };
};

export default api;