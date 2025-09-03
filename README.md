# MultiBot - Full-Stack AI Chatbot

A modern, production-ready chatbot supporting real-time streaming (SSE), multi-model switching (OpenAI, Gemini), and session persistence. Built with React (Vite) and Express.js, deployable on Vercel (frontend) and Render (backend).

---

## 🚀 Features
- **Real-time streaming** responses (SSE)
- **Session management** with persistent chat history
- **Multi-provider support**: OpenAI, Gemini
- **Modern React UI** with ChatGPT-like interface
- **Express.js backend** with streaming endpoints
- **Easy deployment**: Vercel (frontend), Render (backend)

---

## 🛠 Technology Stack
- **Frontend**: React, Vite
- **Backend**: Express.js, Node.js
- **AI Providers**: OpenAI, Gemini
- **Deployment**: Vercel (frontend), Render (backend)

---

## ⚡ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd MultiBot
```

### 2. Backend Setup
```bash
cd backend-express
npm install
# Create .env file (see .env.example below)
npm run dev # or npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Set VITE_API_BASE in Vercel or .env for local
npm run dev
```

### 4. Environment Variables
Create a `.env` file in `backend-express/`:

#### .env.example
```
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key
MAX_OUTPUT_TOKENS=1024
```

Set `VITE_API_BASE` in Vercel frontend environment variables:
```
VITE_API_BASE=https://<your-backend-on-render>.onrender.com
```

---

## 🧪 API Testing Examples

### SSE Streaming (OpenAI)
```bash
curl -N -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}],"provider":"openai","model":"gpt-4o-mini"}' \
  https://<your-backend-on-render>.onrender.com/chat/<session_id>/stream
```

### SSE Streaming (Gemini)
```bash
curl -N -H "Accept: text/event-stream" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello!"}],"provider":"gemini","model":"gemini-pro"}' \
  https://<your-backend-on-render>.onrender.com/chat/<session_id>/stream
```

### Get Models
```bash
curl https://<your-backend-on-render>.onrender.com/models
```

### Create Session
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"user_id":"test-user","title":"New Chat"}' \
  https://<your-backend-on-render>.onrender.com/sessions
```

---

## 🖼 Screenshots

Add screenshots of your application here:
- Chat UI
- Model switcher
- Session sidebar

---

## 👥 Team Members & Contributions

| Name           | Role                | Contributions                |
|----------------|---------------------|------------------------------|
| Ayisha Beghum  | Full Stack Developer| Project lead, backend, frontend|
| Nimsha         | Frontend Developer  | UI/UX, React components      |
| [Add others]   | [Role]              | [Contributions]              |

---

## 📄 License
MIT

---

## 💡 Notes
- For production, restrict CORS origins in backend for security.
- Make sure to set all required API keys in Render and Vercel.
- For favicon, add `favicon.ico` to `frontend/` and link in `index.html`.

---

**Happy Chatting! 🤖**
