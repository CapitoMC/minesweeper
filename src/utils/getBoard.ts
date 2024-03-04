import type { calculateAdjacentMinesProps, countAdjacentMinesProps, placeMinesProps, BoardProps } from "../types";

const MINE = "M";
const EMPTY_CELL = "";

export default function getBoard({ rows, cols, mines }: BoardProps) {
  const newBoard: string[][] = Array(rows).fill(EMPTY_CELL).map(() => Array(cols).fill(EMPTY_CELL));

  placeMines({
    board: newBoard,
    mines,
    rows,
    cols
  });

  calculateAdjacentMines({
    board: newBoard,
    rows,
    cols
  })

  return newBoard;
}

function placeMines({ board, mines, rows, cols }: placeMinesProps): void {
  let minesPlaced = 0;

  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (board[row][col] !== MINE) {
      board[row][col] = MINE;
      minesPlaced++;
    }
  }
}

function calculateAdjacentMines({ board, rows, cols }: calculateAdjacentMinesProps) {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (board[row][col] !== MINE) {
        const count = countAdjacentMines({ board, row, col, rows, cols });
        board[row][col] = `${count.toString()}n`;
      }
    }
  }
}

function countAdjacentMines({ board, col, cols, row, rows }: countAdjacentMinesProps): number {
  let count = 0;

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        board[newRow][newCol] === MINE
      ) {
        count++;
      }
    }
  }

  return count;
}
