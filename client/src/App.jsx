import { useState, useEffect } from "react";
import Board from "./components/Board";
import { createEmptyBoard, HUMAN, AI } from "./constants";
import { checkWinner } from "./gameLogic";
import { getAIMove } from "./ai";

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ human: 0, ai: 0, ties: 0, total_games: 0 });

  // Fetch stats on load
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  // Record game and update stats
  const recordGame = async (winner) => {
    try {
      const res = await fetch("http://localhost:5000/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner }),
      });
      const data = await res.json();
      setStats(data); // update stats immediately from response
    } catch (err) {
      console.error("Failed to record game:", err);
    }
  };

  const handleColumnClick = (col) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);
    setHistory(prev => [...prev, board.map(r => [...r])]);

    // Human move
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

    // AI win check
    result = checkWinner(newBoard);
    if (result.winner === AI) {
      setBoard(newBoard);
      setWinningCells(result.cells);
      setGameOver(true);
      recordGame("ai");
      alert("AI wins!");
      return;
    }

    // Tie check
    const isTie = newBoard.every(row => row.every(cell => cell !== 0));
    if (isTie) {
      setBoard(newBoard);
      setGameOver(true);
      recordGame("tie");
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
    setHistory(prev => prev.slice(0, prev.length - 1));
    setGameOver(false);
    setWinningCells([]);
  };

  const winRatio = stats.total_games > 0 ? ((stats.human / stats.total_games) * 100).toFixed(1) : 0;

  return (
    <div className="app-container">
      <h1>Connect 4</h1>
      <Board
        board={board}
        onColumnClick={handleColumnClick}
        winningCells={winningCells}
      />

      <div style={{ marginTop: "1rem" }}>
        <button onClick={resetGame} style={{ marginRight: "10px" }}>Reset Game</button>
        <button onClick={undoMove}>Undo Last Human Move</button>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <h2>Stats (Global)</h2>
        <p>Total Games: {stats.total_games}</p>
        <p>Human Wins: {stats.human}</p>
        <p>AI Wins: {stats.ai}</p>
        <p>Ties: {stats.ties}</p>
        <p>Win Ratio: {winRatio}%</p>
      </div>
    </div>
  );
}

export default App;
