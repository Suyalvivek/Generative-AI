import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { text } from "express";
import { RecursiveCharacterTextSplitter } from "@langchain/text_splitter";

// Load a PDF file from a local path

// // Load the document(s)
// const docs = await loader.load();

// console.log(docs[0].pageContent);

async function indexTheDocument(filePath) {
  const loader = new PDFLoader(filePath, { splitPages: false });
  //   const docs = await loader.load();
  //   console.log(docs);
  //   console.log(docs.length);
  const doc = await loader.load();
  console.log(doc[0].pageContent);
  console.log(doc.length);
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100, //it will contain 200 characters from the previous chunk to maintain context
  });
  const texts = await textSplitter.splitText(doc[0].pageContent);
  console.log(texts);
}
indexTheDocument("./dummy_internal_wiki.pdf");
