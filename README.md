# 🚀 Enterprise-Grade Multimodal Chat API

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/downloads/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B35?style=for-the-badge)](https://www.trychroma.com/)

A high-performance, resilient, and intelligent multimodal chat API that leverages **Google's Gemini 2.0 Flash** for state-of-the-art multimodal understanding, **FastAPI** for high-speed asynchronous web framework, and **ChromaDB** for persistent, context-aware conversation memory.

## 🌟 Overview

This system is designed for enterprise-grade applications, featuring intelligent API key rotation, robust error handling with automatic retries, optimized video processing, and comprehensive logging. Perfect for building AI-powered applications that need to understand and respond to both text and visual content.

## ✨ Key Features

### 🧠 **Intelligent API Key Management**
- Automatic rotation of Gemini API key pools to prevent rate-limiting
- High availability with usage and failure statistics tracking
- Smart fallback mechanisms for uninterrupted service

### 💾 **Context-Aware Memory**
- ChromaDB vector database for persistent conversation storage
- Semantic similarity search for relevant context retrieval
- Intelligent follow-up responses based on conversation history

### 🚀 **High-Performance Architecture**
- FastAPI with asynchronous request handling
- Uvicorn ASGI server with asyncio event loop
- Concurrent request processing without blocking

### 🎬 **Advanced Multimodal Processing**
- Optimized video and image processing pipeline
- Intelligent frame extraction and resizing
- Support for multiple media formats

### 🔄 **Enterprise-Grade Resilience**
- Exponential backoff retry mechanism
- Automatic API key rotation on rate limits
- Comprehensive error handling and recovery

### 📊 **Monitoring & Analytics**
- Real-time usage statistics and health monitoring
- Detailed logging to file and console
- API key performance metrics

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Backend Framework** | FastAPI |
| **Web Server** | Uvicorn |
| **AI Model** | Google Gemini 2.0 Flash |
| **Vector Database** | ChromaDB |
| **Media Processing** | OpenCV, NumPy |
| **Async Processing** | asyncio, ThreadPoolExecutor |
| **Configuration** | python-dotenv |

## 📋 Prerequisites

- Python 3.8 or higher
- Google Gemini API keys
- Virtual environment (recommended)

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
.\venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Add your Google Gemini API keys
# The system will automatically load and rotate all keys with this prefix
GEMINI_API_KEY_1="AIzaSy...your...first...key"
GEMINI_API_KEY_2="AIzaSy...your...second...key" 
GEMINI_API_KEY_3="AIzaSy...your...third...key"
# Add as many keys as you have for better load distribution
```

> **⚠️ Security Note:** Never commit your `.env` file to version control. Add it to your `.gitignore`.

### 5. Run the Application

```bash
python main.py
```

You should see output similar to:

```
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     🎬 Starting Multimodal Chat API server...
INFO:     🔧 Server Configuration:
INFO:        - Host: localhost
INFO:        - Port: 9000
INFO:     Uvicorn running on http://localhost:9000
```

The API is now available at `http://localhost:9000`

## 📡 API Endpoints

### 🏥 Health Check

**Endpoint:** `GET /`

**Description:** Verify service availability

**Response:**
```json
{
  "status": "ok",
  "message": "Service is running"
}
```

### 📊 Analytics Dashboard

**Endpoint:** `GET /stats`

**Description:** Real-time system statistics and API key performance

**Response:**
```json
{
  "api_key_stats": {
    "key_1_...w2Do": {
      "usage_count": 15,
      "last_error": null,
      "is_current": true
    },
    "key_2_...vl6Y": {
      "usage_count": 12,
      "last_error": 1678886400.123,
      "is_current": false
    }
  },
  "cache_size": 42
}
```

### 🤖 Multimodal Inference

**Endpoint:** `POST /infer`

**Content-Type:** `multipart/form-data`

**Parameters:**
- `prompt` (string, required): Text question or instruction
- `video_file` (file, optional): Image or video file for analysis
- `session_id` (string, optional): Conversation thread identifier

## 💡 Usage Examples

### Text-Only Query

```bash
curl -X POST "http://localhost:9000/infer" \
  -H "accept: text/plain" \
  -F "prompt=What are the benefits of renewable energy?" \
  -F "session_id=conversation_123"
```

### Image Analysis

```bash
curl -X POST "http://localhost:9000/infer" \
  -H "accept: text/plain" \
  -F "video_file=@/path/to/image.jpg" \
  -F "prompt=Describe what you see in this image" \
  -F "session_id=conversation_123"
```

### Video Analysis

```bash
curl -X POST "http://localhost:9000/infer" \
  -H "accept: text/plain" \
  -F "video_file=@/path/to/video.mp4" \
  -F "prompt=What is the main action happening in this clip?" \
  -F "session_id=conversation_123"
```

### Context-Aware Follow-up

```bash
# First message
curl -X POST "http://localhost:9000/infer" \
  -F "prompt=Tell me about machine learning" \
  -F "session_id=ml_discussion"

# Follow-up (will have context from previous message)
curl -X POST "http://localhost:9000/infer" \
  -F "prompt=What are some practical applications?" \
  -F "session_id=ml_discussion"
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │───▶│   FastAPI       │───▶│  Gemini 2.0     │
│                 │    │   Server        │    │  Flash API      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   ChromaDB      │
                       │  Vector Store   │
                       └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Media Pipeline │
                       │ OpenCV/NumPy    │
                       └─────────────────┘
```

## 📁 Project Structure

```
project-root/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
├── chat_api.log          # Application logs (auto-generated)
└── chroma_db/            # ChromaDB storage (auto-generated)
    └── ...
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY_*` | Google Gemini API keys | Yes |
| `HOST` | Server host (default: localhost) | No |
| `PORT` | Server port (default: 9000) | No |
| `LOG_LEVEL` | Logging level (default: INFO) | No |

### Supported Media Formats

- **Images:** JPG, JPEG, PNG, GIF, BMP, TIFF
- **Videos:** MP4, AVI, MOV, WMV, FLV, MKV

## 🚨 Error Handling

The API implements comprehensive error handling:

- **Rate Limiting:** Automatic API key rotation
- **Network Issues:** Exponential backoff retry
- **Invalid Files:** Graceful error messages
- **API Failures:** Fallback mechanisms

## 📈 Performance Optimization

- Asynchronous request processing
- Thread pool for CPU-intensive tasks
- Intelligent video frame sampling
- Vector similarity caching
- Connection pooling

## 🔐 Security Considerations

- API key rotation for security
- Input validation and sanitization
- File type and size restrictions
- Rate limiting protection
- Secure environment variable handling

## 🐛 Troubleshooting

### Common Issues

**1. API Key Errors**
```
Solution: Verify your Gemini API keys in .env file
```

**2. ChromaDB Initialization**
```
Solution: Ensure write permissions in project directory
```

**3. Media Processing Errors**
```
Solution: Check file format and size limitations
```

**4. Port Already in Use**
```
Solution: Change PORT in .env or kill existing process
```

## 📝 Logging

Logs are written to:
- **Console:** Real-time monitoring
- **File:** `chat_api.log` for persistent debugging

Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## 🚀 Deployment

For production deployment:

1. Set up environment variables securely
2. Configure reverse proxy (nginx/Apache)
3. Use process manager (systemd/PM2)
4. Set up monitoring and alerting
5. Configure SSL/TLS certificates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for Gemini 2.0 Flash
- FastAPI team for the excellent framework
- ChromaDB for vector database capabilities
- OpenCV community for media processing tools

---

**Made with ❤️ for the AI community**