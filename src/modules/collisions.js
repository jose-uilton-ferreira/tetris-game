import { NUM_COLUMNS } from "./constants";
import Piece from "./Piece";

export function landCollision(board, piece) {

  piece.row += 1;

  for (let row = 0; row < piece.pieceArray.length; row++) {

    for (let column = 0; column < 5; column++) {

      if (piece.pieceArray[row][column] === 0) continue;

      let newRow = piece.row + row + piece.inicialPosition[1];
      let newColumn = piece.column + column + piece.inicialPosition[0];

      if (newRow >= board.length) return true;

      if (board[newRow][newColumn] !== 0) return true;

    }

  }

  return false;
}

export function moveCollision(board, piece, movement) {

  piece.column += movement;

  for (let row = 0; row < piece.pieceArray.length; row++) {

    for (let column = 0; column < 5; column++) {

      if (piece.pieceArray[row][column] === 0) continue;

      let newRow = piece.row + row + piece.inicialPosition[1];
      let newColumn = piece.column + column + piece.inicialPosition[0];

      if (newColumn >= NUM_COLUMNS || newColumn < 0) return true;

      if (board[newRow][newColumn] !== 0) return true;

    }
  } 

  return false;
}

export function rotateCollision(board, piece) {
 
  piece.__proto__ = Piece.prototype;
  piece.rotatePiece();

  for (let row = 0; row < piece.pieceArray.length; row++) {

    for (let column = 0; column < 5; column++) {

      if (piece.pieceArray[row][column] === 0) continue;

      let newRow = piece.row + row + piece.inicialPosition[1];
      let newColumn = piece.column + column + piece.inicialPosition[0];

      if (newColumn >= NUM_COLUMNS || newColumn < 0) return true;

      if (board[newRow][newColumn] !== 0) return true;

    }
  } 

  return false;

}

export function topCollision(board, piece) {

  for (let row = 0; row < piece.pieceArray.length; row++) {

    for (let column = 0; column < 5; column++) {

      if (piece.pieceArray[row][column] === 0) continue;

      let newRow = piece.row + row + piece.inicialPosition[1];
      let newColumn = piece.column + column + piece.inicialPosition[0];

      if (board[newRow][newColumn] !== 0) return true;

    }

  }

  return false;

}