# Structured Output

Example of asking an LLM for a strict JSON response.

## What It Does

`app.js` uses `response_format: { type: "json_object" }` and a detailed system prompt to generate an interview evaluation object with:

- `confidence`
- `accuracy`
- `pass`

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

