console.log("Agent working");

import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

import { createAgent } from "langchain";

import { TavilySearch } from "@langchain/tavily";

// const message = new HumanMessage("What color is the sky?");

async function main() {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY, // Default value.
    model: "openai/gpt-oss-120b",
    temperature: 0,
  });

  const search = new TavilySearch({
    maxResults: 3,
    topic: "general",
    // includeAnswer: false,
    // includeRawContent: false,
    // includeImages: false,
    // includeImageDescriptions: false,
    // searchDepth: "basic",
    // timeRange: "day",
    // includeDomains: [],
    // excludeDomains: [],
  });

  const agent = createAgent({
    model: model,
    tools: [search],
  });

  const result = await agent.invoke({
    messages: [
      {
        role: "user",
        content: "What is the current weather in Dwarka Delhi?",
      },
    ],
  });

  console.log(
    "Assistant:",
    result.messages[result.messages.length - 1].content,
  );
}
main();
