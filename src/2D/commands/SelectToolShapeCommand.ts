import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { Command } from "../../Command";
import { state } from "../../State";
import { Piece } from "../../types";
import { useAppState } from "../../UI/AppState";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { generateFloatingLabel } from "../hooks/generateFloatingLabel";
import { usePiecesStore } from "../../UI/PiecesStore";

export class SelectToolShapeCommand implements Command {
  private geomId: string;
  private previousSelection: string[];

  constructor(geomId: string) {
    this.geomId = geomId;
    this.previousSelection = state.c_selectedGeometries;
  }

  do() {
    console.log(
  "Store instance:", usePiecesStore, 
  "State snapshot:", usePiecesStore.getState()
);

    state.c_selectedGeometries = [ this.geomId ];

    console.log(Array.from(usePiecesStore.getState().pieces.values()))

    const pieceId = Array.from(usePiecesStore.getState().pieces.values()).filter((piece) => piece.geometryId == this.geomId)[0].id;

    usePiecesStore.getState().setSelectedPiece(pieceId);
    useAppState.getState().labelPiece(pieceId);
  }

  undo() {
    state.c_selectedGeometries = this.previousSelection;
  }
}
