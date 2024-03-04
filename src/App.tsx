import { useState } from "react";
import getBoard from "./utils/getBoard";
import useCounter from "./hooks/useCounter";
import "./App.css";

const MINE = "M";

export default function App() {
  const [gameOver, setGameOver] = useState(false);
  const { counter, setCounter, setStartCounter } = useCounter();
  const [points, setPoints] = useState(0);
  const [face, setFace] = useState("😀");
  const [open, setOpen] = useState(false);
  const [mines, setMines] = useState(10);
  const [rows, setRows] = useState(8);
  const [cols, setCols] = useState(8);
  const [board, setBoard] = useState(getBoard({
    rows: rows,
    cols: cols,
    mines: mines,
  }));

  function handleOpen() {
    setOpen(!open);
  }

  function handleMines(mines: number, cols: number, rows: number) {
    setMines(mines);
    setRows(rows);
    setCols(cols);
    setBoard(getBoard({
      rows: rows,
      cols: cols,
      mines: mines,
    }));
    setOpen(false);
    setGameOver(false);
  }

  function handleCellClick(row: number, col: number) {
    if (gameOver) return;

    const clickedCell = board[row][col];
    const newBoard = [...board]

    if (clickedCell !== "0n" && clickedCell !== MINE && clickedCell !== "R") {
      const newBoard = [...board];

      if (clickedCell === "1n" || clickedCell === "2n" || clickedCell === "3n" && clickedCell.endsWith("n")) {
        setPoints(points + 1);
        newBoard[row][col] = clickedCell.split("n")[0];
      }
      setBoard(newBoard);
      return;
    }

    if (clickedCell !== "0n" && clickedCell !== MINE) {
      return;
    }

    function revealAdjacentZeros(row: number, col: number) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const newRow = row + i;
          const newCol = col + j;

          if (newRow >= 0 && newRow < newBoard.length && newCol >= 0 && newCol < newBoard[0].length) {
            const adjacentCell = newBoard[newRow][newCol];

            if (adjacentCell === "0n" && newBoard[newRow][newCol] !== "R") {
              newBoard[newRow][newCol] = "R";
              revealAdjacentZeros(newRow, newCol);
            } else if (adjacentCell !== MINE) {
              newBoard[newRow][newCol] = adjacentCell;
            }
          }
        }
      }
    }

    if (clickedCell === "0n") {
      newBoard[row][col] = "R";
      revealAdjacentZeros(row, col);
    } else if (clickedCell === MINE) {
      setGameOver(true);
      setFace("😵");
      setStartCounter(false);
      newBoard[row][col] = clickedCell === MINE ? "💣" : clickedCell;
    } else {
      setBoard(newBoard);
      setStartCounter(true);
    }
  }

  function handleFaceMouseDown() {
    setFace("😲");
  }

  function handleFaceMouseUp() {
    setFace("😀");
  }

  function handleReset() {
    setBoard(getBoard({
      rows: rows,
      cols: rows,
      mines: mines,
    }));
    setGameOver(false);
    setCounter(0);
    setStartCounter(false);
    setPoints(0);
    setFace("😀");
  }

  function getCellClass(cell: string) {
    switch (cell) {
      case "0n":
        return "transparent";
      case "1n":
        return "blue";
      case "2n":
        return "green";
      case "3n":
        return "red";
      case "1":
        return "blue revealed";
      case "2":
        return "green revealed";
      case "3":
        return "red revealed";
      case "R":
        return "revealed";
      default:
        return "black";
    }
  }

  return (
    <main className="container" onMouseDown={handleFaceMouseDown} onMouseUp={handleFaceMouseUp}>
      <header className="navbar">
        <div className="title">
          <img src="/mine.png" width={24} alt="" />
          <h1>Minesweeper</h1>
        </div>
        <button className="reset-btn" onClick={handleReset}>
          ⨉
        </button>
      </header>
      <section className="dropdown">
        <button onClick={handleOpen}>
          Game
          <span>
          </span>
        </button>
        {open && (
          <div className="dropdown-menu">
            <button className="btn-mines" onClick={() => handleMines(10, 8, 8)}>10 mines</button>
            <button className="btn-mines" onClick={() => handleMines(12, 10, 10)}>12 mines</button>
            <button className="btn-mines" onClick={() => handleMines(15, 12, 12)}>15 mines</button>
          </div>
        )}
      </section>
      <section className="content">
        <div className="timers">
          <span className="points">{points.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false })}</span>
          <button
            className="face"
            onClick={handleReset}
          >
            {face}
          </button>
          <span className="counter">
            <span>{counter.toLocaleString('en-US', { minimumIntegerDigits: 3, useGrouping: false })}</span>
          </span>
        </div>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="rows">
              {
                row.map((cell, colIndex) =>
                  cell.endsWith("n") || cell === MINE ? (
                    <button
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      key={colIndex}
                      className={`btn ${getCellClass(cell)}`}
                      id="cell"
                      disabled={gameOver}
                    >
                      {gameOver && cell === MINE ? <span className="boom">💣</span> : cell === "R" ? "" : ''}
                    </button>
                  ) : (
                    <button
                      key={colIndex}
                      className={`btn ${getCellClass(cell)}`}
                      disabled
                    >
                      <span>{cell}</span>
                    </button>
                  )
                )
              }
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
