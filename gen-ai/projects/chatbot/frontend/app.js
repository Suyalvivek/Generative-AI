const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn = document.querySelector("#ask");
const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2);
const loading = document.createElement("div");
loading.className = "animate-pulse my-6";
loading.textContent = "Thinking...";

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click", handleAsk);

async function generate(text) {
  // 1.append message to Ui
  // 2.send it to llm
  // 3.append response to Ui

  const msg = document.createElement("div");
  msg.className = `my-6 bg-neutral-700 p-3 rounded-xl ml-auto max-w-fit`;
  msg.textContent = text;
  chatContainer.appendChild(msg);
  input.value = "";

  //   <div class="my-6 bg-neutral-700 p-3 rounded-xl ml-auto max-w-fit">
  //     <h1>User Message</h1>
  //   </div>

  chatContainer.appendChild(loading);
  askBtn.classList.add("opacity-50", "cursor-not-allowed");
  //call server
  const assistantMessage = await callServer(text);

  const assistantMsgElem = document.createElement("div");
  assistantMsgElem.className = `max-w-fit`;
  assistantMsgElem.textContent = assistantMessage;

  loading.remove();
  askBtn.classList.remove("opacity-50", "cursor-not-allowed");
  chatContainer?.appendChild(assistantMsgElem);
}
async function callServer(inputText) {
  // console.log("calling server");

  const response = await fetch("http://localhost:3001/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error("Error generating the response");
  }
  const result = await response.json();
  return result.message;
}
async function handleEnter(e) {
  if (e.key == "Enter") {
    const text = input?.value.trim();
    if (!text) {
      return;
    }
    await generate(text);
  }
}

async function handleAsk(e) {
  const text = input?.value.trim();
  if (!text) {
    return;
  }
  await generate(text);
}
