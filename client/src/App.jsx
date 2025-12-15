import { useState, useEffect } from "react";
import Board from "./components/Board";
import { createEmptyBoard, HUMAN, AI } from "./constants";
import { checkWinner } from "./gameLogic";
import { getAIMove } from "./ai";

// Use environment variable for backend URL (Render in prod, localhost in dev)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [history, setHistory] = useState([]);

  // Global stats fetched from backend
  const [stats, setStats] = useState({
    human: 0,
    ai: 0,
    ties: 0,
    total_games: 0,
  });

  // Session stats (per user)
  const [sessionStats, setSessionStats] = useState({
    human: 0,
    ai: 0,
    ties: 0,
    total: 0,
  });

  // Fetch global stats on load
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        const data = await res.json();
        setStats({
          human: Number(data.human) || 0,
          ai: Number(data.ai) || 0,
          ties: Number(data.ties) || 0,
          total_games: Number(data.total_games) || 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };
    fetchStats();
  }, []);

  // Record game on backend and update global stats
  const recordGame = async (winner) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner }),
      });

      if (!res.ok) throw new Error("Failed to record game");
      const data = await res.json();

      // Update global stats with response
      setStats({
        human: Number(data.human),
        ai: Number(data.ai),
        ties: Number(data.ties),
        total_games: Number(data.total_games),
      });
    } catch (err) {
      console.error("Failed to record game:", err);
    }
  };

  // Update session stats locally
  const recordSessionGame = (winner) => {
    setSessionStats((prev) => ({
      human: prev.human + (winner === "human" ? 1 : 0),
      ai: prev.ai + (winner === "ai" ? 1 : 0),
      ties: prev.ties + (winner === "tie" ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  // Handle a human move
  const handleColumnClick = (col) => {
    if (gameOver) return;

    const newBoard = board.map((row) => [...row]);
    setHistory((prev) => [...prev, board.map((r) => [...r])]);

    // Place human piece
    let placed = false;
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === 0) {
        newBoard[row][col] = HUMAN;
        placed = true;
        break;
      }
    }
    if (!placed) return;

    let result = checkWinner(newBoard);
    if (result.winner === HUMAN) {
      setBoard(newBoard);
      setWinningCells(result.cells);
      setGameOver(true);
      recordGame("human");
      recordSessionGame("human");
      alert("You win!");
      return;
    }

    // AI move
    const aiCol = getAIMove(newBoard);
    if (aiCol !== null) {
      for (let row = 5; row >= 0; row--) {
        if (newBoard[row][aiCol] === 0) {
          newBoard[row][aiCol] = AI;
          break;
        }
      }
    }

    // Check AI win
    result = checkWinner(newBoard);
    if (result.winner === AI) {
      setBoard(newBoard);
      setWinningCells(result.cells);
      setGameOver(true);
      recordGame("ai");
      recordSessionGame("ai");
      alert("AI wins!");
      return;
    }

    // Check tie
    const isTie = newBoard.every((row) => row.every((cell) => cell !== 0));
    if (isTie) {
      setBoard(newBoard);
      setGameOver(true);
      recordGame("tie");
      recordSessionGame("tie");
      alert("Tie game!");
      return;
    }

    setBoard(newBoard);
  };

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setWinningCells([]);
    setHistory([]);
  };

  const undoMove = () => {
    if (history.length === 0) return;
    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setGameOver(false);
    setWinningCells([]);
  };

  const winRatio = stats.total_games > 0 ? ((stats.human / stats.total_games) * 100).toFixed(1) : 0;

  return (
    <div className="app-container">
      <h1>Connect 4</h1>

      <Board board={board} onColumnClick={handleColumnClick} winningCells={winningCells} />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={resetGame} style={{ marginRight: "10px" }}>Reset Game</button>
        <button onClick={undoMove}>Undo Last Human Move</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Global Stats</h2>
        <p>Total Games: {stats.total_games}</p>
        <p>Human Wins: {stats.human}</p>
        <p>AI Wins: {stats.ai}</p>
        <p>Ties: {stats.ties}</p>
        <p>Win Ratio: {winRatio}%</p>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Session Stats</h2>
        <p>Total Games: {sessionStats.total}</p>
        <p>Human Wins: {sessionStats.human}</p>
        <p>AI Wins: {sessionStats.ai}</p>
        <p>Ties: {sessionStats.ties}</p>
      </div>
    </div>
  );
}

export default App;
