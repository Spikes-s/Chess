const boardEl = document.getElementById('board');

const turnDisplay = document.getElementById('turn');

const pieces = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙'
};

let gameBoard = [
  'rnbqkbnr',
  'pppppppp',
  '........',
  '........',
  '........',
  '........',
  'PPPPPPPP',
  'RNBQKBNR'
];

let selected = null;
let currentPlayer = 'white';

function drawBoard() {
  boardEl.innerHTML = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.className = 'square ' + ((row + col) % 2 === 0 ? 'white' : 'black');
      square.dataset.row = row;
      square.dataset.col = col;
      const piece = gameBoard[row][col];
      if (piece !== '.') square.textContent = pieces[piece];
      square.addEventListener('click', () => handleClick(row, col));
      boardEl.appendChild(square);
    }
  }
  turnDisplay.textContent = `Turn: ${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}`;
}

function handleClick(row, col) {
  const piece = gameBoard[row][col];
  if (selected) {
    if (selected.row === row && selected.col === col) {
      selected = null;
      clearHighlights();
      return;
    }
    movePiece(selected.row, selected.col, row, col);
    selected = null;
    
    clearHighlights();
  } else if (piece !== '.' && isCurrentPlayer(piece)) {
    selected = { row, col };
    highlightMoves(row, col);
  }
}

function isCurrentPlayer(piece) {
  return (currentPlayer === 'white' && piece === piece.toUpperCase()) ||
         (currentPlayer === 'black' && piece === piece.toLowerCase());
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  const moving = gameBoard[fromRow][fromCol];
  const target = gameBoard[toRow][toCol];

  // Don't allow capturing your own piece
  if (target !== '.' && !isOpponent(target)) return;

  gameBoard[toRow] = replaceChar(gameBoard[toRow], toCol, moving);
  gameBoard[fromRow] = replaceChar(gameBoard[fromRow], fromCol, '.');

  currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
  drawBoard();
}

function isOpponent(piece) {
  return (currentPlayer === 'white' && piece === piece.toLowerCase()) ||
         (currentPlayer === 'black' && piece === piece.toUpperCase());
}

function highlightMoves(row, col) {
  document.querySelectorAll('.square').forEach(sq => {
    const r = parseInt(sq.dataset.row);
    const c = parseInt(sq.dataset.col);
    if (r === row || c === col) {
      sq.classList.add('highlight');
    }
  });
}

function clearHighlights() {
document.querySelectorAll('.square').forEach(sq => {
    sq.classList.remove('highlight');
  });
}

function replaceChar(str, index, char) {
  return str.substring(0, index) + char + str.substring(index + 1);
}

drawBoard();