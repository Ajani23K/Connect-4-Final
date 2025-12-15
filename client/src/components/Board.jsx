import Column from "./Column";
import { COLS } from "../constants";
import "./Board.css";

export default function Board({ board, onColumnClick, winningCells }) {
  return (
    <div className="board">
      {Array.from({ length: COLS }).map((_, colIndex) => (
        <Column
          key={colIndex}
          columnIndex={colIndex}
          board={board}
          onClick={onColumnClick}
          winningCells={winningCells}
        />
      ))}
    </div>
  );
}
