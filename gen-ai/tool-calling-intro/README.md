# Tool Calling Intro

Introductory example of exposing a function tool to an LLM.

## What It Does

`app.js` defines a `webSearch` tool schema and asks the model a weather question. The local `webSearch` function is currently mocked and returns a hardcoded value, so this folder focuses on the tool-calling flow rather than real search results.

## Setup

```bash
npm install
```

Required environment variable:

```bash
GROQ_API_KEY=your_groq_api_key
```

## Run

```bash
GROQ_API_KEY=your_groq_api_key node app.js
```

## Files

- `app.js` - Tool-calling demo.
- `tool.png` - Supporting image for the lesson/demo.

