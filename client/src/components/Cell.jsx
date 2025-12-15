import { HUMAN, AI } from "../constants";

export default function Cell({ value, row, col, winningCells }) {
  let color = "white";
  if (value === HUMAN) color = "red";
  if (value === AI) color = "yellow";

  // Highlight winning cells with a white border
  const isWinner = winningCells.some(([r, c]) => r === row && c === col);
  const borderStyle = isWinner ? "4px solid white" : "2px solid #00000000"; // transparent when not winner

  return (
    <div
      style={{
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        backgroundColor: color,
        border: borderStyle,
        margin: "2px",
        boxSizing: "border-box", // ensures border doesn't grow element size
      }}
    />
  );
}
