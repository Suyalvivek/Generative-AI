# Company Chatbot RAG

Retrieval-augmented chatbot over a company knowledge-base PDF.

## What It Does

This project indexes `dummy_internal_wiki.pdf` into Pinecone using Gemini embeddings, then answers questions by retrieving relevant chunks and sending them to a Groq chat model.

## Files

- `prepare.js` - Loads the PDF, splits it into chunks, creates embeddings, and configures Pinecone.
- `rag.js` - Indexes `dummy_internal_wiki.pdf`.
- `chat.js` - Starts an interactive retrieval chat loop.
- `dummy_internal_wiki.pdf` - Sample internal knowledge-base document.

## Setup

```bash
npm install
```

Required environment variables:

```bash
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
GROQ_API_KEY=your_groq_api_key
```

The Pinecone index should use 768 dimensions because `prepare.js` sets Gemini embeddings to `outputDimensionality: 768`.

## Index the PDF

```bash
GEMINI_API_KEY=your_gemini_api_key PINECONE_API_KEY=your_pinecone_api_key PINECONE_INDEX_NAME=your_index node rag.js
```

## Chat

```bash
GEMINI_API_KEY=your_gemini_api_key PINECONE_API_KEY=your_pinecone_api_key PINECONE_INDEX_NAME=your_index GROQ_API_KEY=your_groq_api_key node chat.js
```

Type `/bye` to exit.

