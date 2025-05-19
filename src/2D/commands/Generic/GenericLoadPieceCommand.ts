import { Command } from "../../../Command";
import { state } from "../../../State";
import { Piece } from "../../../types";
import { useAppState } from "../../../UI/AppState";

export class GenericLoadPieceCommand implements Command {
  private piece: Piece;
  constructor(piece:Piece) {
    this.piece = piece;
  }

  do() {
    state.pieces.push(this.piece);
    useAppState.getState().addPiece(this.piece);
  }

  undo() {
    state.pieces = state.pieces.filter((piece:Piece) => piece.id != this.piece.id);
    useAppState.getState().removePiece(this.piece.id);
  }

}