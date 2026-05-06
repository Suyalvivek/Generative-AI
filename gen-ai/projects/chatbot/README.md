# Chatbot Project

Full-stack chatbot with a browser frontend and an Express backend.

## What It Does

The frontend sends messages to the backend. The backend uses Groq for chat completions, Tavily for web search tool calls, and `node-cache` to keep per-thread conversation history.

## Folders

- `backend` - Express API and LLM/tool-calling logic.
- `frontend` - Static HTML and JavaScript chat UI.

## Run

Start the backend first:

```bash
cd backend
npm install
GROQ_API_KEY=your_groq_api_key TAVILY_API_KEY=your_tavily_api_key npm start
```

Then open `frontend/index.html` in a browser. By default, the frontend calls `http://localhost:3001/chat`.

If you want a different backend URL, create `frontend/config.js` and set:

```js
window.BACKEND_API_URL = "http://localhost:3001";
```

