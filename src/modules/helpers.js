import { NUM_COLUMNS, NUM_ROWS } from "./constants";
import Piece from "./Piece";
import { PIECES } from './pieces';

export function rand(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}

export function generatePiece(ctx) {
  return new Piece(ctx, rand(0, PIECES.length));
}

export function isEmptyLine(array, row) {
  return (array[row]).every(value => value === 0);
}

export function isFullLine(array, row) {
  return (array[row]).every(value => value !== 0);
}

export function generateBoard() {
  return Array.from({ length: NUM_ROWS }, value => Array.from({ length: NUM_COLUMNS }, value => 0));
}