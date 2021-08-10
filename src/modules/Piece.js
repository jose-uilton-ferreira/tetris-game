import * as constants from "./constants";
import { rand } from "./helpers";
import { PIECES, INICIAL_POSITIONS } from "./pieces";

export default class Piece {

  constructor(ctx, type) {

    this.type = type;
    this.ctx = ctx;
    this.rotate = 0;
    this.pieceArray = PIECES[type][this.rotate];
    this.inicialPosition = INICIAL_POSITIONS[this.type][this.rotate];

    this.colorCode = rand(0, constants.COLORS_PIECES.length);
    this.color = constants.COLORS_PIECES[this.colorCode];

    this.row = 0;
    this.column = constants.NUM_COLUMNS / 2;

  }

  rotatePiece() {

    this.rotate++;

    if (this.rotate > 3) this.rotate = 0;

    this.pieceArray = PIECES[this.type][this.rotate];
    this.inicialPosition = INICIAL_POSITIONS[this.type][this.rotate];

  }

  draw() {

    for (let row = 0; row < this.pieceArray.length; row++) {

      for (let column = 0; column < 5; column++) {

        if (this.pieceArray[row][column] === 0) continue;

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
          (this.column + column + this.inicialPosition[0]) * constants.PIECE_SIZE,
          (this.row + row + this.inicialPosition[1]) * constants.PIECE_SIZE,
          constants.PIECE_SIZE, constants.PIECE_SIZE
        );

      }

    }

  }

}