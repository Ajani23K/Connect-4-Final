export const ROWS = 6;
export const COLS = 7;


export const EMPTY = 0;
export const HUMAN = 1;
export const AI = 2;

export function createEmptyBoard() {
return Array.from({ length: ROWS }, () =>
Array(COLS).fill(EMPTY)
);
}