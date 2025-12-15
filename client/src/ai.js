import { COLS, EMPTY, AI } from "./constants";

/**
 * Returns a random valid column for AI
 */
export function getAIMove(board) {
  const validCols = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === EMPTY) validCols.push(col);
  }

  if (validCols.length === 0) return null; // board full

  return validCols[Math.floor(Math.random() * validCols.length)];
}
