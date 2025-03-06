import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { Command } from "../../Command";
import { state } from "../../State";
import { Piece } from "../../types";
import { useAppState } from "../../UI/store";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { generateFloatingLabel } from "../hooks/generateFloatingLabel";

export class SelectToolShapeCommand implements Command {
  private shapeIndex: number;
  private previousSelection: number[];

  constructor(shapeIndex: number) {
    this.shapeIndex = shapeIndex;
    this.previousSelection = state.c_selected_shapes;
  }

  do() {
    state.c_selected_shapes = [ this.shapeIndex ];
    // state.c_pointmap = new Map()
    console.log(`Shape ${this.shapeIndex} selected.`);
    generateFloatingLabel(this.shapeIndex);
  }

  undo() {
    state.c_selected_shapes = this.previousSelection;
    console.log(`Selection reverted to shape ${this.previousSelection}`);
  }
}
