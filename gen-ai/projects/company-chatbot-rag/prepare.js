import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API_KEY,
  modelName: "gemini-embedding-001",
  outputDimensionality: 768,        // Matches your existing index
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME);

export const vectorStore = new PineconeStore(embeddings, {
  pineconeIndex,
  maxConcurrency: 5,
});

export async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  const [doc] = await loader.load();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const texts = await textSplitter.splitText(doc.pageContent);

  const documents = texts.map((chunk, i) => ({
    pageContent: chunk,
    metadata: {
      ...doc.metadata,
      source: filePath,
      chunkIndex: i,
    },
  }));

  console.log(`✅ Created ${documents.length} document chunks`);

  // Test embedding
  const testVector = await embeddings.embedQuery("Test embedding");
  console.log(`✅ Embedding dimension: ${testVector.length}`);

  console.log("📤 Adding documents to Pinecone...");
  const ids = await vectorStore.addDocuments(documents);
  
  console.log("🎉 Successfully indexed!", ids.length, "vectors added.");
}

