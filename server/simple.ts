import "dotenv/config";
import express from "express";
import { db } from "./db";
import { pages } from "@shared/schema";

const app = express();
const PORT = 5000;

app.use(express.json());

// Test endpoint
app.get("/api/pages", async (req, res) => {
  try {
    if (!db) {
      return res.status(500).json({ error: 'Database not connected' });
    }
    const result = await db.select().from(pages);
    res.json({ success: true, count: result.length, data: result });
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: 'OK', db: !!db });
});

app.listen(PORT, () => {
  console.log(`✅ Simple server running on port ${PORT}`);
});
