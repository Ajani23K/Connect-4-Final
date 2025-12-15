import Column from "./Column";
import { COLS } from "../constants";
import "./Board.css";


export default function Board({ board, onColumnClick }) {
return (
<div className="board">
{Array.from({ length: COLS }).map((_, colIndex) => (
<Column
key={colIndex}
columnIndex={colIndex}
board={board}
onClick={onColumnClick}
/>
))}
</div>
);
}