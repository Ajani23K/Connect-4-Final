import { useState } from "react";
import Board from "./components/Board";
import { createEmptyBoard, HUMAN, AI } from "./constants";
import { checkWinner } from "./gameLogic";
import { getAIMove } from "./ai";

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ human: 0, ai: 0, ties: 0 }); // stats state

  const handleColumnClick = (col) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);
    setHistory(prev => [...prev, board.map(r => [...r])]);

    // --- Human move ---
    let placed = false;
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row][col] === 0) {
        newBoard[row][col] = HUMAN;
        placed = true;
        break;
      }
    }
    if (!placed) return;

    // Check human win
    let result = checkWinner(newBoard);
    if (result.winner === HUMAN) {
      setBoard(newBoard);
      setWinningCells(result.cells);
      setGameOver(true);
      setStats(prev => ({ ...prev, human: prev.human + 1 }));
      alert("You win!");
      return;
    }

    // --- AI move ---
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
      setStats(prev => ({ ...prev, ai: prev.ai + 1 }));
      alert("AI wins!");
      return;
    }

    // Check for tie (board full)
    const isTie = newBoard.every(row => row.every(cell => cell !== 0));
    if (isTie) {
      setBoard(newBoard);
      setGameOver(true);
      setStats(prev => ({ ...prev, ties: prev.ties + 1 }));
      alert("Tie game!");
      return;
    }

    setBoard(newBoard);
  };

  // --- Reset the game ---
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setGameOver(false);
    setWinningCells([]);
    setHistory([]);
  };

  // --- Undo last human move ---
  const undoMove = () => {
    if (history.length === 0) return;

    const previousBoard = history[history.length - 1];
    setBoard(previousBoard);
    setHistory(prev => prev.slice(0, prev.length - 1));
    setGameOver(false);
    setWinningCells([]);
  };

  // --- Calculate total games and win ratio ---
  const totalGames = stats.human + stats.ai + stats.ties;
  const winRatio = totalGames > 0 ? ((stats.human / totalGames) * 100).toFixed(1) : 0;

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
        <h2>Stats</h2>
        <p>Total Games: {totalGames}</p>
        <p>Human Wins: {stats.human}</p>
        <p>AI Wins: {stats.ai}</p>
        <p>Ties: {stats.ties}</p>
        <p>Win Ratio: {winRatio}%</p>
      </div>
    </div>
  );
}

export default App;
