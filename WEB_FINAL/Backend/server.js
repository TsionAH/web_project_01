import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/db.js';
import { inngest } from './inngest/index.js'; // your inngest client
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is running'));

// Example: handling incoming events from Inngest
app.post('/api/inngest', async (req, res) => {
  try {
    // Use inngest to handle events
    await inngest.handle(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error handling event');
  }
});

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
