import { Command } from "../../../Command";
import { state } from "../../../State";
import { Piece } from "../../../types";

export class GenericLoadPieceCommand implements Command {
  private piece: Piece;
  constructor(piece:Piece) {
    this.piece = piece;
  }

  do() {
    state.pieces.set(this.piece.id, this.piece);
  }

  undo() {
    state.pieces.delete(this.piece.id);
  }

}