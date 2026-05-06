# Chatbot Backend

Express API for the browser chatbot project.

## What It Does

- Serves `GET /` as a health check.
- Serves `POST /chat` for chatbot messages.
- Uses Groq chat completions.
- Uses Tavily as a web search tool.
- Stores message history by `threadId` using `node-cache`.

## Setup

```bash
npm install
```

Required environment variables:

```bash
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

Optional environment variable:

```bash
PORT=3001
```

## Run

```bash
GROQ_API_KEY=your_groq_api_key TAVILY_API_KEY=your_tavily_api_key npm start
```

## API

```http
POST /chat
Content-Type: application/json

{
  "threadId": "unique-thread-id",
  "message": "What is the latest AI news?"
}
```

Response:

```json
{
  "message": "Assistant response"
}
```

