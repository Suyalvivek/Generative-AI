import express from "express";
import { generate } from "./chatbot.js";
import cors from "cors";
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, this is the chatbot server!");
});

app.post("/chat", async (req, res) => {
  const { message, threadId } = req.body;

  // validation
  if (!message || !threadId) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const result = await generate(message, threadId);
    res.json({ message: result });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
