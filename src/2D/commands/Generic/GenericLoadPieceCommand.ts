import { Command } from "../../../Command";
import { state } from "../../../State";
import { Piece } from "../../../types";
import { useAppState } from "../../../UI/AppState";
import { usePiecesStore } from "../../../UI/PiecesStore";
import { drawCanvasFromState } from "../../rendering/canvas";

export class GenericLoadPieceCommand implements Command {
  private piece: Piece;
  constructor(piece:Piece) {
    this.piece = piece;
  }

  do() {
    // state.pieces.push(this.piece);
    usePiecesStore.getState().addPiece(this.piece);
    drawCanvasFromState(state);
  }

  undo() {
    state.pieces = state.pieces.filter((piece:Piece) => piece.id != this.piece.id);
    usePiecesStore.getState().removePiece(this.piece.id);
  }

}