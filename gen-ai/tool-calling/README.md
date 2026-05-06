# Tool Calling

Interactive terminal chatbot that can call Tavily search when it needs current information.

## What It Does

`app.js` starts a command-line chat loop. The model can call a `webSearch` tool, the app runs the search through Tavily, then sends the tool result back to the model so it can answer.

Type `bye` to exit the chat loop.

## Setup

```bash
npm install
```

Required environment variables:

```bash
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
```

## Run

```bash
GROQ_API_KEY=your_groq_api_key TAVILY_API_KEY=your_tavily_api_key node app.js
```

