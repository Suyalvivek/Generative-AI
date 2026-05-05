// Implementation Plan
// 1. INDEXING
//     - Load the document (pdf,text),
//     - Chunk the document
//     - Generate Vector Embeddings
//     - Store the Vector Embeddings in Vector debugger.
// 2. USING CHATBOT
//     - Setup LLM
//     - Add Retrieval steps
//     - Pass Input + Relevant info to LLM
//     - Congrats

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { GoogleGenAI } from "@google/genai";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  model: "text-embedding-004", // Specify the model version
});

//Pinecone client
// const pinecone = new Pinecone();
const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  //   const docs = await loader.load();
  //   console.log(docs);
  //   console.log(docs.length);
  const doc = await loader.load();
  // console.log(doc[0].pageContent);
  // console.log(doc.length);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100, //it will contain 200 characters from the previous chunk to maintain context
  });
  const texts = await textSplitter.splitText(doc[0].pageContent);

  // console.log(texts);
  const documents = texts.map((chunk) => {
    return {
      pageContent: chunk,
      metadata: {
        metadata: doc[0].metadata,
      },
    };
  });
  console.log(documents);
  const embeddings = await vectorStore.addDocuments(documents);
  console.log(embeddings);
}
indexTheDocument("./dummy_internal_wiki.pdf");
