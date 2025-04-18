import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { useAppState } from "../../UI/store";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { generateUUID } from "three/src/math/MathUtils";
import { Piece } from "../../types";

export class SelectToolAddShapeCommand implements Command {
  shapeIndex:number;

  constructor( shapeIndex:number ) {
    this.shapeIndex = shapeIndex;
  }

  do() {
    state.c_selected_shapes.push(this.shapeIndex);
  }

  undo() {
    state.c_selected_shapes.pop(); // could  be a splice for better accuracy but I really depend on this being rather clean overall so I don't think this is a huge risk
  }
  
}