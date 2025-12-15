import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const app = express();

// CORS middleware - allow Vercel domains dynamically
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    
    // Allow any Vercel deployment (vercel.app domain)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }
    
    // If you have a custom domain, add it here
    // if (origin === "https://yourdomain.com") {
    //   return callback(null, true);
    // }
    
    // Reject all other origins
    return callback(new Error("Not allowed by CORS"), false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- Record a game ---
app.post("/api/game", async (req, res) => {
  const { winner } = req.body;

  try {
    await pool.query(
      `INSERT INTO stats (human_wins, ai_wins, ties) VALUES ($1,$2,$3)`,
      [
        winner === "human" ? 1 : 0,
        winner === "ai" ? 1 : 0,
        winner === "tie" ? 1 : 0,
      ]
    );

    const result = await pool.query(`
      SELECT
        COALESCE(SUM(human_wins),0)::int AS human,
        COALESCE(SUM(ai_wins),0)::int AS ai,
        COALESCE(SUM(ties),0)::int AS ties,
        COALESCE(SUM(human_wins + ai_wins + ties),0)::int AS total_games
      FROM stats
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Fetch global stats ---
app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(SUM(human_wins),0)::int AS human,
        COALESCE(SUM(ai_wins),0)::int AS ai,
        COALESCE(SUM(ties),0)::int AS ties,
        COALESCE(SUM(human_wins + ai_wins + ties),0)::int AS total_games
      FROM stats
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));