import { HUMAN, AI, EMPTY } from "../constants";
import { useEffect, useState } from "react";

export default function Cell({ value, row, col, winningCells }) {
  const [dropped, setDropped] = useState(false);

  // Trigger animation when piece is placed
  useEffect(() => {
    if (value !== EMPTY) {
      setDropped(false); // reset for new piece
      const timeout = setTimeout(() => setDropped(true), 50);
      return () => clearTimeout(timeout);
    }
  }, [value]);

  const isWinner = winningCells.some(([r, c]) => r === row && c === col);

  let pieceColor = "transparent"; // default empty
  if (value === HUMAN) pieceColor = "red";
  if (value === AI) pieceColor = "yellow";

  return (
    <div
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        border: isWinner ? "4px solid white" : "none",
        backgroundColor: "white", // outer cell always visible
        margin: "2px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "flex-start", // allow piece to drop from top
        justifyContent: "center",
      }}
    >
      {value !== EMPTY && (
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            backgroundColor: pieceColor,
            transform: dropped ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.3s ease-out",
          }}
        />
      )}
    </div>
  );
}
