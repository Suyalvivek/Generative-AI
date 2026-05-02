import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main() {
    const completion = await groq.chat.completions.create({

        // temperature: 0.8,
        // top_p:0.9,
        // stop: '11', 
        model: 'openai/gpt-oss-120b',
        // max_completion_tokens: 50,
        // frequency_penalty: 2,/
        response_format: {
            'type': 'json_object',
        },
        messages: [
            {
                role: 'system',
                // content: `You are VS, a smart sentiment analyser , your task is to analyse given review and analyse the sentiment.
                // You must classify this review as positive, negative or neutral.Respond only with a valid JSON structureusing this example
                // example:{"Sentiment" :"Negative"}`

                content:`You are an interview grader assistant.Your task is to generate candidate evaluation score.
                            Output must be following JSON structure:
                            {
                                "confidence":number(1-10 scale),
                                "accuracy":number(1-10 scale),
                                "pass":boolean(true or false),
                            }
                            The response must :
                            1.Include all fields shown above.
                            2.Use only exact field names shown.
                            3.Follow the exact data types specified.
                            4.Contain only the json object and nothing else.    
                            `
            },
            {
                role: 'user',
                // content: `Review: These headphones arrived quickly and look great , but the left earcup stopped working after a week.
                // Sentiment:'' `
                content: `Q: What does == do in Javascript?
                            A: It compares the values of two variables. `

            },

        ],

    });
    console.log(completion.choices[0].message.content);


}

main();
