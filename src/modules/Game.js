import { landCollision, moveCollision, rotateCollision, topCollision } from './collisions';
import * as constants from './constants';
import { generatePiece, isEmptyLine, generateBoard, isFullLine } from './helpers';
import { INICIAL_POSITIONS } from './pieces';

export default class Game {

  constructor() {

    this.ctx = document.getElementById('scene').getContext('2d');
    this.scoreDisplay = document.getElementById('score');
    this.levelDisplay = document.getElementById('level');
    this.nextDisplay = document.getElementById('next-piece').getContext('2d');
    this.keysPressed = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    this.board = generateBoard();

    this.gameOver = false;
    this.score = 0;
    this.level = 1;
    this.timerate = 800;
    this.timePassed = 0;

    this.currentPiece = generatePiece(this.ctx);
    this.currentPiece.column = constants.NUM_COLUMNS / 2;

    this.nextPiece = generatePiece(this.nextDisplay);
    this.nextPiece.column = 0;
    this.updateNextPiece();

  }

  update(timestep) {

    // move the piece if keys were pressed
    if (this.keysPressed.left) {
      
      if (!moveCollision(this.board, Object.assign({}, this.currentPiece), -1)) {
        this.currentPiece.column += -1;
      } 

      this.keysPressed.left = false;
    }

    if (this.keysPressed.right) {
      
      if (!moveCollision(this.board, Object.assign({}, this.currentPiece), 1)) {
        this.currentPiece.column += 1;
      } 

      this.keysPressed.right = false;
    }

    if (this.keysPressed.up) {

      if (!rotateCollision(this.board, Object.assign({}, this.currentPiece))) {
        this.currentPiece.rotatePiece();
      } 

      this.keysPressed.up = false;
    }

    if (this.keysPressed.down) {
      
      if (!landCollision(this.board, Object.assign({}, this.currentPiece))) {
        this.currentPiece.row += 1;
      } else {
        this.fillingPiece();
        this.clearFullLines();

        this.currentPiece = this.nextPiece;
        this.currentPiece.ctx = this.ctx;
        this.nextPiece = generatePiece(this.nextDisplay);
        this.nextPiece.column = 0;
        
        this.updateNextPiece();
      }

      this.keysPressed.down = false;
    }

    // move the piece for down
    this.timePassed += timestep;

    if (this.timePassed >= this.timerate) {

      if (topCollision(this.board, Object.assign({}, this.currentPiece))) {
        this.gameOver = true;
        return;
      }

      if (!landCollision(this.board, Object.assign({}, this.currentPiece))) {
        this.currentPiece.row += 1;
      } else {
        this.fillingPiece();
        this.clearFullLines();

        this.currentPiece = this.nextPiece;
        this.currentPiece.ctx = this.ctx;
        this.nextPiece = generatePiece(this.nextDisplay);
        this.nextPiece.column = 0;
        
        this.updateNextPiece();
      }

      this.timePassed = 0;
    }

  }

  fillingPiece() {

    for (let row = 0; row < this.currentPiece.pieceArray.length; row++) {

      for (let column = 0; column < 5; column++) {

        if (this.currentPiece.pieceArray[row][column] === 0) continue;

        let newColumn = this.currentPiece.column + column + this.currentPiece.inicialPosition[0];
        let newRow = this.currentPiece.row + row + this.currentPiece.inicialPosition[1];

        this.board[newRow][newColumn] = this.currentPiece.colorCode + 1;

      }

    }

  }

  clearFullLines() {

    for (let row = constants.NUM_ROWS - 1; row >= 0; row--) {

      if (isEmptyLine(this.board, row)) break;

      if (isFullLine(this.board, row)) {

        this.score += 10;

        let breakpoint = row;
        let nextRow = row - 1;

        while (nextRow > 0 || !isEmptyLine(this.board, nextRow)) {

          this.board[breakpoint] = [...this.board[nextRow]];
          this.board[nextRow] = Array.from({ length: constants.NUM_COLUMNS }, value => 0);

          if (!isFullLine(this.board, breakpoint)) {
            breakpoint--;
          }
          else {
            this.score += 10;
          } 

          nextRow--;

        }

      }

    }

    this.updateScore();

  }

  updateScore() {

    this.scoreDisplay.innerText = this.score;

    if (this.score !== 0 && this.score % 200 === 0) {
  
      if (this.level < 13) {
        this.score += 1;
        this.level++;
        this.timerate -= 50;
        this.levelDisplay.innerText = this.level;
      }
    }

  }

  updateNextPiece() {

    this.nextDisplay.fillStyle = '#30272a';
    this.nextDisplay.fillRect(0, 0, 125, 125);
    this.nextPiece.draw();
    
  }

  draw() {

    // clear the screen
    this.ctx.fillStyle = '#30272a';
    this.ctx.fillRect(0, 0, constants.WIDTH, constants.HEIGHT);

    this.currentPiece.draw();

    // draw the board
    for (let row = constants.NUM_ROWS - 1; row >= 0; row--) {

      if (isEmptyLine(this.board, row)) break;

      for (let column = 0; column < constants.NUM_COLUMNS; column++) {

        if (this.board[row][column] === 0) continue;

        this.ctx.fillStyle = constants.COLORS_PIECES[this.board[row][column] - 1];
        this.ctx.fillRect(column * constants.PIECE_SIZE, 
          row * constants.PIECE_SIZE, constants.PIECE_SIZE, constants.PIECE_SIZE);

      }

    }

  }

}