import express from "express";
import { inngestHandler } from "./inngest/handler.js";
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./configs/db.js";

const app = express();
await connectDB();

app.use(express.json());
app.use(cors());

// 🔥 THIS IS WHAT YOU WERE MISSING
app.use("/api/inngest", inngestHandler);

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});