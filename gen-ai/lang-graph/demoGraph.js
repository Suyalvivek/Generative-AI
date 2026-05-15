/*
1.Cut the vegetables
2.Boil the rice
3.Add the salt
4.Taste the Biryani
*/
import{StateGraph,StateSchema,MessagesValue,START,END} from "@langchain/langgraph";
import fs from "node:fs";
const State = new StateSchema({
  messages: MessagesValue,
});

function cutTheVegetables(state){
    console.log("Cutting Vegetables");
    return state; 
}
function boilTheRice(state){
    console.log("Boiling the Rice");
    return state;  
}
function addTheSalt(state){
    console.log("Add the required amount of salt");
    return state; 

}
function tasteTheBiryani(state){
    console.log("tasting the biryani");
    return state; 

}

//in built 
/**
 * where to go
 * 
 */
function whereToGo(){
    if(true){
        return "END";

    }else{
        return "addTheSalt";
    }
}

const graph = new StateGraph(State).addNode("cutTheVegetables",cutTheVegetables)
.addNode("boilTheRice",boilTheRice)
.addNode("addTheSalt",addTheSalt)
.addNode("tasteTheBiryani",tasteTheBiryani)
.addEdge(START,"cutTheVegetables")
.addEdge("cutTheVegetables","boilTheRice")
.addEdge("boilTheRice","addTheSalt")
.addEdge("addTheSalt","tasteTheBiryani")
.addConditionalEdges("tasteTheBiryani",whereToGo,{
        END:END,
        addTheSalt:"addTheSalt"

});
// .addEdge("tasteTheBiryani",addTheSalt) // to create a loop in the graph


//runnable process
const demoProcess = graph.compile();


async function main(){

/Graph Visualisation/
const drawableGraphGraphState = await demoProcess.getGraphAsync();
const graphStateImage = await drawableGraphGraphState.drawMermaidPng();
const graphStateArrayBuffer = await graphStateImage.arrayBuffer();
const filePath = "./graphState.png";
fs.writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

    const finalState= await demoProcess.invoke({
    messages:[]
});
console.log('final',finalState);
}

main();