import express from "express";
import { inngestHandler } from "./inngest/handler.js";

const app = express();

app.use(express.json());

// 🔥 THIS IS WHAT YOU WERE MISSING
app.use("/api/inngest", inngestHandler);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});