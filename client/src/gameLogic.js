import { ROWS, COLS, EMPTY } from "./constants";

/**
 * Returns:
 *   { winner: 0, cells: [] } if no winner
 *   { winner: 1 or 2, cells: [[row,col], ...] } if someone won
 */
export function checkWinner(board) {
  // Horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (cell !== EMPTY &&
          cell === board[row][col+1] &&
          cell === board[row][col+2] &&
          cell === board[row][col+3]) {
        return { winner: cell, cells: [
          [row, col],
          [row, col+1],
          [row, col+2],
          [row, col+3]
        ] };
      }
    }
  }

  // Vertical
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row <= ROWS - 4; row++) {
      const cell = board[row][col];
      if (cell !== EMPTY &&
          cell === board[row+1][col] &&
          cell === board[row+2][col] &&
          cell === board[row+3][col]) {
        return { winner: cell, cells: [
          [row, col],
          [row+1, col],
          [row+2, col],
          [row+3, col]
        ] };
      }
    }
  }

  // Diagonal top-left → bottom-right
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (cell !== EMPTY &&
          cell === board[row+1][col+1] &&
          cell === board[row+2][col+2] &&
          cell === board[row+3][col+3]) {
        return { winner: cell, cells: [
          [row, col],
          [row+1, col+1],
          [row+2, col+2],
          [row+3, col+3]
        ] };
      }
    }
  }

  // Diagonal bottom-left → top-right
  for (let row = 3; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      const cell = board[row][col];
      if (cell !== EMPTY &&
          cell === board[row-1][col+1] &&
          cell === board[row-2][col+2] &&
          cell === board[row-3][col+3]) {
        return { winner: cell, cells: [
          [row, col],
          [row-1, col+1],
          [row-2, col+2],
          [row-3, col+3]
        ] };
      }
    }
  }

  return { winner: 0, cells: [] };
}
