import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
    const completion = await groq.chat.completions.create({
        temperature: 0,
        model: "llama-3.3-70b-versatile",
        messages: [
            {
                role: 'system',
                content: `You are a smart personal assistant. Your task is to answer the asked questions.
                You have access to following tools:
                1.searchWeb({query}:{query:string}) //Search the latest information and realtime data on internet`,

            },
            {
                role: 'user',
                content: `Q: What is the weather in delhi?`
            }
        ],
        tools: [
            {
                type: 'function',
                function: {
                    name: 'webSearch',
                    description: 'Search the latest information and realtime data on internet',
                    parameters: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'The search query to perform search on'
                            },
                        },
                        required: ['query'],

                    },
                },
            },
        ],
        tool_choice: 'auto'
    })
    const toolCalls = completion.choices[0].message.tool_calls;
    if (!toolCalls) {//means content is there
        console.log(`Assistant:${completion.choices[0].message.content}`);
        return;
    }
    for (const tool of toolCalls) {
        console.log('tool', tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments
        if (functionName == 'webSearch') {
            const toolResult = await webSearch(JSON.parse(functionParams));
            console.log("Tool Result: ", toolResult);
        }
    }
    console.log(JSON.stringify(completion.choices[0].message, null, 2));
}
//tavily api call
async function webSearch({ query }) {
    console.log('Calling WebSearch....')
    return "Launched yesterday"
}
console.log(main());