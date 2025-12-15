import Cell from "./Cell";

export default function Column({ columnIndex, board, onClick, winningCells }) {
  return (
    <div className="column" onClick={() => onClick(columnIndex)}>
      {board.map((row, rowIndex) => (
        <Cell
          key={rowIndex}
          row={rowIndex}
          col={columnIndex}
          value={row[columnIndex]}
          winningCells={winningCells}
        />
      ))}
    </div>
  );
}
