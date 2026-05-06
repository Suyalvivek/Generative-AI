const userContainer = document.querySelector("#input");
function getUserInput() {
  userContainer.addEventListener("keypress", (e) => {
    let userInput = "";
    if (e.key === "Enter") {
      userInput = userContainer.value;
    }
  });
  return userInput;
}
console.log(getUserInput());
