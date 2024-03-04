export interface BoardProps {
  rows: number;
  cols: number;
  mines: number;
}

export interface placeMinesProps {
  board: string[][];
  mines: number;
  rows: number;
  cols: number;
}

export interface calculateAdjacentMinesProps {
  board: string[][];
  rows: number;
  cols: number;
}

export interface countAdjacentMinesProps {
  board: string[][],
  row: number,
  col: number,
  rows: number,
  cols: number
}
