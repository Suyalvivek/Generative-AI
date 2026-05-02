const input = document.querySelector("#input");
const chatContainer = document.querySelector("#chat-container");
const askBtn  = document.querySelector("#ask");

input.addEventListener("keyup", handleEnter);
askBtn.addEventListener("click",handleAsk);


function generate(text) {
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
}



function handleEnter(e) {
  if (e.key == "Enter") {
    const text = input?.value.trim();
    if (!text) {
      return;
    }
    generate(text);
  }
}


function handleAsk(e){
    const text = input?.value.trim();
    if (!text) {
      return;
    }
    generate(text);

}