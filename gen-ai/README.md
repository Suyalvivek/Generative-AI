# Gen AI

This folder contains small Node.js examples and project builds for learning common generative AI patterns.

## Folders

- `llm-invoke` - Minimal Groq chat completion call.
- `prompt-message-structure` - Basic system/user message structure.
- `system-prompt` - Sentiment analysis using a system prompt.
- `llm-settings` - Prompting example for controlling a model response.
- `structured-output` - JSON-only response formatting.
- `tool-calling-intro` - First look at function/tool calling.
- `tool-calling` - Interactive terminal assistant with Tavily web search.
- `projects` - Larger chatbot and RAG projects.

## Common Setup

Most examples use Node.js with ES modules and require API keys through environment variables.

```bash
cd gen-ai/<folder-name>
npm install
GROQ_API_KEY=your_key node app.js
```

Some projects need extra keys. Check each folder README for the exact variables and run commands.

