import { COLS, ROWS, EMPTY, AI, HUMAN } from "./constants";
import { checkWinner } from "./gameLogic";

/**
 * Returns a column for AI using minimax algorithm
 * Depth-limited to 4 for reasonable performance
 */
export function getAIMove(board) {
  const depth = 4;
  let bestScore = -Infinity;
  let bestCol = null;

  for (let col = 0; col < COLS; col++) {
    if (board[0][col] !== EMPTY) continue;

    const tempBoard = dropPiece(board, col, AI);
    const score = minimax(tempBoard, depth - 1, false);
    if (score > bestScore) {
      bestScore = score;
      bestCol = col;
    }
  }

  return bestCol !== null ? bestCol : randomMove(board);
}

// Drop a piece in a column (returns new board)
function dropPiece(board, col, player) {
  const newBoard = board.map(row => [...row]);
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][col] === EMPTY) {
      newBoard[row][col] = player;
      break;
    }
  }
  return newBoard;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  const result = checkWinner(board);
  if (result.winner === AI) return 1000 + depth;   // win sooner is better
  if (result.winner === HUMAN) return -1000 - depth; // lose later is better
  if (depth === 0) return evaluateBoard(board);   // heuristic evaluation

  const player = isMaximizing ? AI : HUMAN;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let col = 0; col < COLS; col++) {
    if (board[0][col] !== EMPTY) continue;
    const newBoard = dropPiece(board, col, player);
    const score = minimax(newBoard, depth - 1, !isMaximizing);
    if (isMaximizing) {
      bestScore = Math.max(bestScore, score);
    } else {
      bestScore = Math.min(bestScore, score);
    }
  }

  return bestScore;
}

// Simple heuristic: count 2-in-a-row and 3-in-a-row
function evaluateBoard(board) {
  let score = 0;

  function countPatterns(player) {
    let total = 0;

    // Horizontal
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const window = board[row].slice(col, col + 4);
        total += scoreWindow(window, player);
      }
    }

    // Vertical
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row <= ROWS - 4; row++) {
        const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
        total += scoreWindow(window, player);
      }
    }

    // Diagonal TL-BR
    for (let row = 0; row <= ROWS - 4; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const window = [
          board[row][col],
          board[row + 1][col + 1],
          board[row + 2][col + 2],
          board[row + 3][col + 3]
        ];
        total += scoreWindow(window, player);
      }
    }

    // Diagonal BL-TR
    for (let row = 3; row < ROWS; row++) {
      for (let col = 0; col <= COLS - 4; col++) {
        const window = [
          board[row][col],
          board[row - 1][col + 1],
          board[row - 2][col + 2],
          board[row - 3][col + 3]
        ];
        total += scoreWindow(window, player);
      }
    }

    return total;
  }

  score += countPatterns(AI);
  score -= countPatterns(HUMAN);
  return score;
}

// Assign points to a 4-cell window
function scoreWindow(window, player) {
  const opp = player === AI ? HUMAN : AI;
  const countPlayer = window.filter(v => v === player).length;
  const countEmpty = window.filter(v => v === EMPTY).length;
  const countOpp = window.filter(v => v === opp).length;

  if (countPlayer === 4) return 100;
  if (countPlayer === 3 && countEmpty === 1) return 10;
  if (countPlayer === 2 && countEmpty === 2) return 5;
  if (countOpp === 3 && countEmpty === 1) return -8; // block threat
  return 0;
}

// Fallback random move
function randomMove(board) {
  const validCols = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === EMPTY) validCols.push(col);
  }
  if (validCols.length === 0) return null;
  return validCols[Math.floor(Math.random() * validCols.length)];
}
