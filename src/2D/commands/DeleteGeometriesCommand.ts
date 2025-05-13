import { Command } from "../../Command"
import { state } from "../../State"
import { Geometry2D, Piece } from "../../types";
import { useAppState } from "../../UI/AppState";
import { drawCanvasFromState, redrawCanvas } from "../rendering/canvas";


export class DeleteGeometriesCommand implements Command {

  geometryIds: string[];
  geometries: Map<string, Geometry2D>;
  pieces: Piece[];

  constructor(geometries:string[]) { 
    this.geometryIds = geometries; 
    this.geometries = new Map(state.c_geometryMap);
    this.pieces = [];
  }

  do() {
    this.geometryIds.forEach((geomId:string) => {
      state.c_geometryMap.delete(geomId);
      const pieceIndex = state.pieces.findIndex((piece:Piece) => piece.geometryId === geomId);
      this.pieces = [...this.pieces, ...state.pieces.splice(pieceIndex, 1)];
      const pieceId = this.pieces[this.pieces.length - 1].id;
      useAppState.getState().removePiece(pieceId);
    });
    drawCanvasFromState(state);
  }

  undo() {
    state.c_geometryMap = this.geometries;
    state.pieces = [...state.pieces, ...this.pieces];
    
  }
}