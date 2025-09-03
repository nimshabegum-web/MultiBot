# Chatbot Capstone - Full-Stack AI Chatbot

A production-ready, full-stack chatbot with **SSE streaming**, **session persistence**, and **multi-provider model switching**.

## 🚀 Features

- **Real-time streaming** responses with token-by-token display
- **Session management** with persistent chat history
- **Multi-provider support**: OpenAI, Anthropic, Gemini, Ollama (BONUS)
- **Modern React UI** with ChatGPT-like interface
- **FastAPI backend** with async streaming endpoints
- **Postgres database** for data persistence
- **Rate limiting** and token caps for cost control

## 🏗️ Architecture

```
Frontend (React + Vite) ←→ Backend (FastAPI) ←→ AI Providers
                              ↓
                        Postgres Database
```

## 📦 Quick Start

### 1. Clone & Setup
```bash
git clone <your-repo>
cd chatbot-capstone
```

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Database Setup
```bash
# Start Postgres (from project root)
docker compose up -d

# Or use your own Postgres instance
# Update DATABASE_URL in .env
```

### 4. Environment Configuration
```bash
# Copy and fill your API keys
cp env.example .env
# Edit .env with your actual API keys
```

### 5. Start Backend
```bash
cd backend
export PYTHONPATH=.
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 6. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key
- `ANTHROPIC_API_KEY`: Your Anthropic API key  
- `GEMINI_API_KEY`: Your Google Gemini API key
- `OLLAMA_BASE_URL`: Local Ollama instance (optional)
- `DATABASE_URL`: Postgres connection string
- `MAX_OUTPUT_TOKENS`: Token limit (default: 1024)

### AI Providers
- **OpenAI**: GPT-4o-mini, GPT-4o-mini-translate
- **Anthropic**: Claude 3.5 Haiku
- **Gemini**: Gemini 1.5 Flash
- **Ollama**: Local models (llama3, phi3, qwen2)

## 🧪 Testing

### Test SSE Streaming
```bash
curl -N -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}],"provider":"openai","model":"gpt-4o-mini"}' \
  http://localhost:8000/chat/<session_id>/stream
```

### API Endpoints
- `GET /models` - Available providers and models
- `POST /sessions` - Create new chat session
- `GET /sessions` - List user sessions
- `GET /sessions/{id}` - Get session messages
- `POST /chat/{id}/stream` - Stream chat responses (SSE)

## 🎯 Assignment Requirements

This boilerplate covers all **mandatory requirements**:

✅ **SSE Streaming** - Real-time token-by-token responses  
✅ **Session Management** - Users, sessions, message persistence  
✅ **Multi-Provider Switching** - OpenAI + Anthropic/Gemini  
✅ **Modern UI/UX** - ChatGPT-like interface  
✅ **Database Persistence** - Postgres with SQLAlchemy  
✅ **Rate Limiting** - Configurable token caps  
✅ **Environment Security** - .env for API keys  

## 🚀 Deployment

### Local Development
- Backend: `uvicorn app:app --reload`
- Frontend: `npm run dev`
- Database: `docker compose up -d`

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000
```

## 🔍 Project Structure

```
chatbot-capstone/
├─ backend/                 # FastAPI application
│  ├─ app.py              # Main API endpoints
│  ├─ providers/          # AI provider implementations
│  ├─ models.py           # Database models
│  ├─ schemas.py          # Pydantic schemas
│  └─ requirements.txt    # Python dependencies
├─ frontend/              # React application
│  ├─ src/
│  │  ├─ components/      # React components
│  │  ├─ hooks/          # Custom hooks (useSSE)
│  │  └─ api/            # API client
│  └─ package.json       # Node dependencies
├─ docker-compose.yml     # Postgres setup
└─ env.example           # Environment template
```

## 🎉 Bonus Features

- **Ollama Integration**: Local OSS models
- **Markdown Rendering**: Rich message display
- **Copy to Clipboard**: Easy message copying
- **Responsive Design**: Mobile-friendly interface

## 📚 Next Steps

1. **Customize UI**: Modify colors, fonts, layout
2. **Add Features**: File uploads, code highlighting
3. **Enhance Security**: User authentication, rate limiting
4. **Deploy**: AWS, Vercel, or your preferred platform

---

**Happy Coding! 🚀**

This boilerplate gives you a solid foundation to build upon. All the complex parts (SSE, providers, database) are already implemented - focus on your unique features and polish!
