var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == "number") {
    turn(square.target.id, huPlayer);
    let gameWon = checkWin(origBoard, huPlayer);
    if (gameWon) gameOver(gameWon);
    else {
      if (!checkTie()) turn(bestSpot(), aiPlayer);
      gameWon = checkWin(origBoard, aiPlayer);
    }
    if (gameWon) gameOver(gameWon);
  }
}

function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares(board) {
  return board.filter((s) => typeof s == "number");
}

function bestSpot() {
  var emptyspace = emptySquares(origBoard);
  console.log("empty " + emptyspace);
  var temp, temp_board, min = -11, min_index;
  for (var i = 0; i < emptyspace.length; i++) {
    temp_board = origBoard.slice(0)
    temp_board[emptyspace[i]] = aiPlayer;
    console.log("mini " + temp_board);
    temp = minimax(temp_board, huPlayer);
    if (temp > min) {
      min = temp;
      min_index = emptyspace[i];
    }
    if (min == 10)
      break;
    console.log("index " + emptyspace[i] + " val " + min);
  }
  return min_index;
}

function checkTie() {
  if (emptySquares(origBoard).length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(board, player) {
  console.log("mini after " + board);
  var emptyspace = emptySquares(board);
  if (emptyspace.length == 0) {
    console.log("empty at end " + evaluate(board) + " " + board);
    return evaluate(board);
  }

  var eval = evaluate(board);
  if (eval != 0)
    return eval;

  var temp_board, val, temp_val, val_index;
  if (player == aiPlayer) {
    val = -11;
    for (var i = 0; i < emptyspace.length; i++) {
      temp_board = board.slice(0);
      temp_board[emptyspace[i]] = aiPlayer;
      temp_val = minimax(temp_board, huPlayer);
      if (temp_val > val) {
        val = temp_val;
      }
      if (val == 10)
        break;
    }
  }

  if (player == huPlayer) {
    val = 11;
    for (var i = 0; i < emptyspace.length; i++) {
      temp_board = board.slice(0);
      temp_board[emptyspace[i]] = huPlayer;
      temp_val = minimax(temp_board, aiPlayer);
      if (temp_val < val) {
        val = temp_val;
      }
      if (val == -10)
        break;
    }
  }
  return val;
}
function evaluate(board) {
  for (var row = 0; row < 3; row++) {
    if (board[row] == board[row + 3] && board[row] == board[row + 6]) {
      if (board[row] == huPlayer)
        return -10;
      else if (board[row] == aiPlayer)
        return 10;
    }
  }
  for (var col = 0; col < 7; col += 3) {
    if (board[col] == board[col + 1] && board[col] == board[col + 2]) {
      if (board[col] == huPlayer)
        return -10;
      else if (board[col] == aiPlayer)
        return 10;
    }
  }
  if ((board[0] == board[4] && board[0] == board[8]) || (board[2] == board[4] && board[2] == board[6])) {
    if (board[4] == huPlayer)
      return -10;
    else if (board[4] == aiPlayer)
      return 10;
  }
  return 0;
}
