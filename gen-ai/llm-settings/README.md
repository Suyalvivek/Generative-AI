# LLM Settings

Small prompt-control example for a Groq chat completion.

## What It Does

`app.js` sends a sentiment-analysis prompt and prints the model's single-word response. It is a useful place to experiment with model options like temperature, token limits, penalties, and stop sequences.

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

