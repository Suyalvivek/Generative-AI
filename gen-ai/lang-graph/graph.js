/**
 * Connecting LLM
 * building the graph
 * Invoke the agent
 * Add the memory
 **/
import readline from 'node:readline/promises';
import{StateGraph,StateSchema,MessagesValue,START,END, MemorySaver} from "@langchain/langgraph";
import {ChatGroq} from '@langchain/groq';
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { TavilySearch } from "@langchain/tavily";
import { z } from "zod";
import { printGraph } from "./utils.js";

// memory
const checkpointer = new MemorySaver();


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

const tools  = [search,calendarEvents];
const toolNode = new ToolNode(tools);

//INITIALIZING THE LLM
const llm = new ChatGroq({
    model:"openai/gpt-oss-120b",
    temperature:0,

}).bindTools(tools);



// BUILD THE GRAPH
const State =  new StateSchema({
    messages:MessagesValue,
})
async function callModel(State){
    //call the llm
    console.log("Calling model");
    const response = await llm.invoke(State.messages);
    // console.log("Response in Call Model",response);
    return {
        messages:[response]//ADDING THE RESPONSE TO THE MESSAGES STATE

    };

}
function callTools(State){

}
function shouldContinue(State){
    // check the previous ai message , if tool call is asked by ai else return end
    // console.log("messages",State.messages);

    const lastMsg = State.messages[State.messages.length - 1];
    if(lastMsg.tool_calls?.length){
        return "tools"
    }
    return "__end__";

}


// build the graph
const graph = new StateGraph(State)
.addNode("llm",callModel)
.addNode("tools",toolNode)
.addEdge(START,"llm")
.addEdge("tools","llm")
.addConditionalEdges("llm",shouldContinue,{
  //mapping
  __end:END,
  tools:'tools'
}
);

const app = graph.compile({checkpointer});

async function main(){
  let config ={configurable:{thread_id:'conversation-num-1'}};
  await printGraph(app,'./customGraph.png')
  // take user input

  const rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
  })
  while(true){
    const userInput = await rl.question("You:");
    if(userInput=='/bye'){
      break;
      }
        const result = await app.invoke({
        messages:[{
            role:"user",
            content: userInput
        }],


    },config);
    // console.log("result",result);
    const messages = result.messages;
    const final = messages[messages.length-1];
    console.log("final message ",final.content);
  }
  rl.close();
    
}
main()