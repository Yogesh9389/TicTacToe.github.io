// The game board
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

// The current player
let currentPlayer = 'X';

// The function to make a move
function makeMove(row, col) {
  // If the cell is already occupied, do nothing
  if (board[row][col] !== '') {
    return;
  }

  // Update the board and the UI
  board[row][col] = currentPlayer;
  document.getElementById(row.toString() + col.toString()).textContent = currentPlayer;

  // Check if the game is over
  if (gameOver(board)) {
    endGame();
    return;
  }

  // Switch to the next player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

  // If it's the AI's turn, make a move
  if (currentPlayer === 'O') {
    let bestMove = findBestMove(board);
    makeMove(bestMove.row, bestMove.col);
  }
}

// The function to evaluate the game state
function evaluate(board) {
  // Check rows
  for (let row = 0; row < board.length; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === 'X') {
        return -10;
      } else if (board[row][0] === 'O') {
        return 10;
      }
    }
  }

  // Check columns
  for (let col = 0; col < board[0].length; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === 'X') {
        return -10;
      } else if (board[0][col] === 'O') {
        return 10;
      }
    }
  }

  // Check diagonals
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === 'X') {
      return -10;
    } else if (board[0][0] === 'O') {
      return 10;
    }
  }

  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === 'X') {
      return -10;
    } else if (board[0][2] === 'O') {
      return 10;
    }
  }

  // Otherwise, return 0
  return 0;
}

// The function to determine if the game is over
function gameOver(board) {
  // Check if the game is a tie
  if (!hasEmptyCell(board)) {
    return true;
  }

  // Check if there is a winner
  if (evaluate(board) !== 0) {
    return true;
  }

  // Otherwise, the game is not over
  return false;
}

// The function to check if there is an empty cell
function hasEmptyCell(board) {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      if (board[row][col] === '') {
        return true;
      }
    }
  }

  return false;
}

// The function to determine the best move using the minimax algorithm
function minimax(board, depth, isMaximizingPlayer) {
  if (gameOver(board)) {
    return evaluate(board);
  }

  if (isMaximizingPlayer) {
    let bestScore = -Infinity;
    let bestMove = {};

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (board[row][col] === '') {
          board[row][col] = 'O';
          let score = minimax(board, depth + 1, false);
          board[row][col] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row, col };
          }
        }
      }
    }

    return depth === 0 ? bestMove : bestScore;
  } else {
    let bestScore = Infinity;
    let bestMove = {};

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        if (board[row][col] === '') {
          board[row][col] = 'X';
          let score = minimax(board, depth + 1, true);
          board[row][col] = '';
          if (score < bestScore) {
            bestScore = score;
            bestMove = { row, col };
          }
        }
      }
    }

    return depth === 0 ? bestMove : bestScore;
  }
}

// The function to find the best move using the minimax algorithm
function findBestMove(board) {
  return minimax(board, 0, true);
}

// The function to end the game
function endGame() {
  // Disable the event listeners
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      document.getElementById(i.toString() + j.toString()).removeEventListener('click', handleClick);
    }
  }

  // Get the result message
  let resultMessage = '';
  if (evaluate(board) === 0) {
    resultMessage = "It's a tie!";
  } else if (evaluate(board) === -10) {
    resultMessage = 'You win!';
  } else if (evaluate(board) === 10) {
    resultMessage = 'The AI wins!';
  }

  // Show the result message
  document.getElementById('result').textContent = resultMessage;
}

// The event listener for each cell
function handleClick(event) {
  let row = parseInt(event.target.id.charAt(0));
  let col = parseInt(event.target.id.charAt(1));
  makeMove(row, col);
}

// Add event listeners to each cell
for (let i = 0; i < board.length; i++) {
  for (let j = 0; j < board[0].length; j++) {
    document.getElementById(i.toString() + j.toString()).addEventListener('click', handleClick);
  }
}

