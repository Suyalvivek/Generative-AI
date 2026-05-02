import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
async function main(){
    const completion = await groq.chat.completions.create({
        
        model:'llama-3.3-70b-versatile',
        messages:[
            {
                role:'system',
                content:'You are VS, a smart sentiment analyser , your task is to analyse given review and analyse the sentiment.Output must be a sungle word.'
            },  
            {
                role:'user',
                content:`Review: These headphones arrived quickly and look great , but the left earcup stopped working after a week.
                 Sentiment : `
            },
            
        ],

    });
    console.log(completion.choices[0].message.content);
 

}

main();
