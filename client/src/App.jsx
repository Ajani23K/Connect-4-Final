import { useState } from "react";
import Board from "./components/Board";
import { createEmptyBoard, HUMAN, AI } from "./constants";
import { checkWinner } from "./gameLogic";
import { getAIMove } from "./ai";

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winningCells, setWinningCells] = useState([]);

  const handleColumnClick = (col) => {
    if (gameOver) return;

    const newBoard = board.map(row => [...row]);

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

    // Check human win
    let result = checkWinner(newBoard);
    if (result.winner === HUMAN) {
      setBoard(newBoard);
      setWinningCells(result.cells);
      setGameOver(true);
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
      alert("AI wins!");
      return;
    }

    setBoard(newBoard);
  };

  return (
    <div className="app-container">
      <h1>Connect 4</h1>
      <Board
        board={board}
        onColumnClick={handleColumnClick}
        winningCells={winningCells}
      />
    </div>
  );
}

export default App;
