import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const app = express();

// Allowed origins for frontend (add your Vercel URL here)
const allowedOrigins = [
  "http://localhost:5173",
  "https://connect-4-final-9b6nt30c4-ajanis-projects-0e1d2182.vercel.app"
];

// CORS middleware with proper preflight handling
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error("Not allowed by CORS"), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
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
        COALESCE(SUM(human_wins),0)::int as human,
        COALESCE(SUM(ai_wins),0)::int as ai,
        COALESCE(SUM(ties),0)::int as ties,
        COALESCE(SUM(human_wins + ai_wins + ties),0)::int as total_games
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
        COALESCE(SUM(human_wins),0)::int as human,
        COALESCE(SUM(ai_wins),0)::int as ai,
        COALESCE(SUM(ties),0)::int as ties,
        COALESCE(SUM(human_wins + ai_wins + ties),0)::int as total_games
      FROM stats
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
