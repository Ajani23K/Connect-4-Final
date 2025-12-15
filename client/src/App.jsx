import { useState } from "react";
import Board from "./components/Board";
import { createEmptyBoard, HUMAN } from "./constants";


function App() {
const [board, setBoard] = useState(createEmptyBoard());
const [gameOver, setGameOver] = useState(false);


const handleColumnClick = (col) => {
if (gameOver) return;


const newBoard = board.map(row => [...row]);


for (let row = 5; row >= 0; row--) {
if (newBoard[row][col] === 0) {
newBoard[row][col] = HUMAN;
break;
}
}


setBoard(newBoard);
};


return (
<div className="app-container">
<h1>Connect 4</h1>
<Board board={board} onColumnClick={handleColumnClick} />
</div>
);
}


export default App;