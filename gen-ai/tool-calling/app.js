import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages = [
    {
      role: "system",
      content: `You are a smart personal assistant. Your task is to answer the asked questions.
                You have access to following tools:
                1.webSearch({query}:{query:string})
                currently you dont have access to any data but you can use the above tool to search the latest information and realtime data on internet to answer the question. Always try to use the tool if the question is related to latest information or realtime data.
                //Search the latest information and realtime data on internet`,
    },
    // {
    //   role: "user",
    //   content: `Q: What is the weather in delhi?`,
    // },
  ];

  while (true) {
    //user input loop
    const question = await rl.question("Ask a question: ");
    if (question == "bye") {
      console.log("Exiting...");
      process.exit(0);
    }
    messages.push({
      role: "user",
      content: question,
    });
    //react loop
    while (true) {
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

      const toolCalls = completion.choices[0].message.tool_calls;
      if (!toolCalls) {
        //means content is there
        console.log(`Assistant:${completion.choices[0].message.content}`);
        // return;
        break;
      }
      for (const tool of toolCalls) {
        console.log("tool", tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;
        if (functionName == "webSearch") {
          const toolResult = await webSearch(JSON.parse(functionParams));
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
}
//tavily api call
async function webSearch({ query }) {
  const response = await tvly.search(query, { max_results: 2 });
  console.log("Calling WebSearch....");
  // console.log("Response", response);
  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  console.log(finalResult);
  return finalResult;
}
main();
