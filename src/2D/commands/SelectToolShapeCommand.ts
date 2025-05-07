import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { Command } from "../../Command";
import { state } from "../../State";
import { Piece } from "../../types";
import { useAppState } from "../../UI/store";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { generateFloatingLabel } from "../hooks/generateFloatingLabel";

export class SelectToolShapeCommand implements Command {
  private geomId: string;
  private previousSelection: string[];

  constructor(geomId: string) {
    this.geomId = geomId;
    this.previousSelection = state.c_selectedGeometries;
  }

  do() {
    if (!state.c_selectedGeometries.some(id => id === this.geomId)) {
      state.c_selectedGeometries.push(this.geomId);
    }
    generateFloatingLabel(this.geomId);
  }

  undo() {
    state.c_selectedGeometries = this.previousSelection;
  }
}
