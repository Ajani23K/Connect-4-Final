import Cell from "./Cell";


export default function Column({ columnIndex, board, onClick }) {
return (
<div className="column" onClick={() => onClick(columnIndex)}>
{board.map((row, rowIndex) => (
<Cell key={rowIndex} value={row[columnIndex]} />
))}
</div>
);
}