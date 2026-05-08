console.log("Agent working");
import { read, writeFileSync } from "node:fs";
import readline from "node:readline/promises";
import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

import { createAgent } from "langchain";

import { TavilySearch } from "@langchain/tavily";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { MemorySaver } from "@langchain/langgraph-checkpoint";
import { threadId } from "node:worker_threads";

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
  //CUSTOM TOOL CALLING
  const calendarEvents = tool(
    async ({ query }) => {
      // Custom logic here
      // return "You have a meeting at 3 PM today.";
      return JSON.stringify([
        {
          title: "Meeting with Yogesh",
          time: "3 PM",
          description: "Discuss the project timeline",
        },
      ]);
    },
    {
      name: "get-calendar-events",
      description: "Call to get calendar events for a user",
      schema: z.object({
        query: z
          .string()
          .describe("The query to be used for calendar event search"),
      }),
    },
  );
  // 1. Initialize the in-memory checkpointer
  const checkpointer = new MemorySaver();

  const agent = createAgent({
    model: model,
    tools: [search, calendarEvents],
    checkpointer: checkpointer,
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  while (true) {
    const userQuery = await rl.question("Enter your query: ");
    if (userQuery === "bye") {
      console.log("Goodbye!");
      break;
    }
    const result = await agent.invoke({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant.Use the provided tool to get the information if you don't have it. Current Date and time: ${new Date().toUTCString()}",
        },

        {
          role: "user",
          // content: "Do i have any meetings today?",
          content: userQuery,
        },
      ],
    },{
      configurable:{
        thread_id:'1',
      }
    });

    console.log(
      "Assistant:",
      result.messages[result.messages.length - 1].content,
    );
  }
  rl.close();

  const drawableGraphGraphState = await agent.getGraphAsync();
  const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
  const graphStateArrayBuffer = await graphStateImage.arrayBuffer();

  const filePath = "./graphState.png";
  writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));
}
main();
