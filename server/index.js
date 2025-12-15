import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const app = express();
app.use(cors({
  origin: "http://localhost:5173" // your React frontend
}));
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Record a game result
app.post("/api/game", async (req, res) => {
  const { winner } = req.body; // "human", "ai", "tie"

  try {
    await pool.query(
      `INSERT INTO stats (human_wins, ai_wins, ties)
       VALUES ($1, $2, $3)`,
      [
        winner === "human" ? 1 : 0,
        winner === "ai" ? 1 : 0,
        winner === "tie" ? 1 : 0,
      ]
    );
    res.json({ message: "Game recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Fetch global stats
app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT SUM(human_wins) as human, SUM(ai_wins) as ai, SUM(ties) as ties
       FROM stats`
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});
// Test database connection
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1+1 AS test");
    res.json({ message: "Database works", result: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
