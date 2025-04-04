import { useState } from "react";
import "./App.css";

const EMPTY = null;
const PLAYER_X = "X";
const PLAYER_O = "O";

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],            // Diagonals
];

function App() {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
  const [winner, setWinner] = useState(null);

  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(EMPTY) ? null : "Draw";
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = playerTurn;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      setPlayerTurn(playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X);
      if (playerTurn === PLAYER_X) {
        setTimeout(() => makeAIMove(newBoard), 500);
      }
    }
  };

  const makeAIMove = (board) => {
    let bestScore = -Infinity;
    let bestMove = null;

    board.forEach((cell, index) => {
      if (cell === EMPTY) {
        let tempBoard = [...board];
        tempBoard[index] = PLAYER_O;
        let score = minimax(tempBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = index;
        }
      }
    });

    if (bestMove !== null) {
      board[bestMove] = PLAYER_O;
      setBoard([...board]);
      const gameWinner = checkWinner(board);
      if (gameWinner) {
        setWinner(gameWinner);
      } else {
        setPlayerTurn(PLAYER_X);
      }
    }
  };

  const minimax = (board, depth, isMaximizing) => {
    let result = checkWinner(board);
    if (result === PLAYER_X) return -10 + depth;
    if (result === PLAYER_O) return 10 - depth;
    if (result === "Draw") return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      board.forEach((cell, index) => {
        if (cell === EMPTY) {
          let tempBoard = [...board];
          tempBoard[index] = PLAYER_O;
          let score = minimax(tempBoard, depth + 1, false);
          bestScore = Math.max(score, bestScore);
        }
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      board.forEach((cell, index) => {
        if (cell === EMPTY) {
          let tempBoard = [...board];
          tempBoard[index] = PLAYER_X;
          let score = minimax(tempBoard, depth + 1, true);
          bestScore = Math.min(score, bestScore);
        }
      });
      return bestScore;
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY));
    setPlayerTurn(PLAYER_X);
    setWinner(null);
  };

  return (
    <div className="container">
      <h1>Tic-Tac-Toe (AI Mode)</h1>
      <div className="board">
        {board.map((cell, index) => (
          <div
            key={index}
            className={`cell ${cell ? "filled" : ""} ${winner && winningCombinations.some((combo) => combo.includes(index) && combo.every((i) => board[i] === winner)) ? "highlight" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </div>
        ))}
      </div>
      {winner && (
        <div className="result">
          <h2>{winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
