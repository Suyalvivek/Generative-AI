import readline from "node:readline/promises";
import Groq from "groq-sdk";
import { vectorStore } from "./prepare.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  while (true) {
    const question = await rl.question("Ask a question: ");
    if (question == "/bye") {
      break;
    }

    // RETRIEVAL STEP
    // directly we can use the vector store
    const relevantChunks = await vectorStore.similaritySearch(question, 3);

    const context = relevantChunks
      .map((chunk) => chunk.pageContent)
      .join("\n\n");

    const SYSTEM_PROMPT = `You are an assistant for a company's internal knowledge base. Use the following retrieved information to answer the question. If you don't know the answer, say you don't know. Always use the provided information and do not make up answers`;

    const userQuery = `Question: ${question}\n\nRelevant Information:\n${context}
    \nAnswer:`;

    const completion = await groq.chat.completions.create({
      messages: [

        {
            role: "system",
            content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      model: "qwen/qwen3-32b",
    });

    console.log("Answer:", completion.choices[0].message.content);

  }

    rl.close();

}
chat();
