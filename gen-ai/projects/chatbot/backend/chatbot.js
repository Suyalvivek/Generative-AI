import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import NodeCache from "node-cache";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // Cache results for 1 hour

export async function generate(userMessage, threadId) {
  const baseMessages = [
    {
      role: "system",
      content: `You are a smart personal assistant. Your job is to answer user questions as helpfully and accurately as possible.

You have access to the following tool:
1. webSearch({query}:{query:string}) — Use this tool to search the latest information and real-time data on the internet.

You do NOT have access to any private or internal data. If a question requires up-to-date or real-time information, always use the webSearch tool.

## Example (Few-shot Prompting)

User: Who won the cricket world cup in 2023?
Assistant (calls tool): webSearch({"query": "cricket world cup 2023 winner"})
Tool result: England won the 2023 Cricket World Cup.
Assistant: England won the 2023 Cricket World Cup.

User: What is the capital of France?
Assistant: The capital of France is Paris.

Always follow this pattern: If the answer requires current or real-time information, use the tool. Otherwise, answer directly if you know the fact.
`,
    },
  ];
  const messages = cache.get(threadId) ?? baseMessages;
  messages.push({
    role: "user",
    content: userMessage,
  });
  //react loop
  let count = 0;
  const MAX_RETRIES = 5;
  while (true) {
    if (count >= MAX_RETRIES) {
      return "Sorry, I'm having trouble retrieving the information right now. Please try again later.";
    }
    count++;

    //tool calling loop
    const completion = await groq.chat.completions.create({
      temperature: 0,
      model: "llama-3.3-70b-versatile",
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "Search the latest information and realtime data on internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });
    //after we get the first response from the model,what we will do is we will store the resposne of the model in history
    messages.push(completion.choices[0].message);
    const toolCalls = completion.choices[0].message.tool_calls;
    log("toolCalls", toolCalls);
    if (!toolCalls) {
      cache.set(threadId, messages);
      // console.log(cache);
      //means content is there
      return completion.choices[0].message.content;
    }
    for (const tool of toolCalls) {
      // console.log("tool", tool);
      const functionName = tool.function.name;
      let functionParams = tool.function.arguments;
      try {
        functionParams =
          typeof functionParams === "string"
            ? JSON.parse(functionParams)
            : functionParams;
      } catch (err) {
        console.error("Error parsing tool arguments:", err);
        functionParams = {};
      }
      if (functionName == "webSearch") {
        const toolResult = await webSearch(functionParams);
        // console.log("Tool Result: ", toolResult);
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }
    // const completion2 = await groq.chat.completions.create({
    //   temperature: 0,
    //   model: "llama-3.3-70b-versatile",
    //   messages: messages,
    //   tools: [
    //     {
    //       type: "function",
    //       function: {
    //         name: "webSearch",
    //         description:
    //           "Search the latest information and realtime data on internet",
    //         parameters: {
    //           type: "object",
    //           properties: {
    //             query: {
    //               type: "string",
    //               description: "The search query to perform search on",
    //             },
    //           },
    //           required: ["query"],
    //         },
    //       },
    //     },
    //   ],
    //   tool_choice: "auto",
    // });

    // console.log(JSON.stringify(completion2.choices[0].message, null, 2));
  }
}
//tavily api call
async function webSearch({ query }) {
  const response = await tvly.search(query, { max_results: 2 });
  console.log("Calling WebSearch....");
  // console.log("Response", response);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  // console.log(finalResult);
  return finalResult;
}
