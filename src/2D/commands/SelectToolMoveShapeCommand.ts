import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { computeCentroid } from "../geometry/centroid";

export class SelectToolMoveShapeCommand implements Command {
  private shapeIndex:number;
  private __from:Vector2;
  private __to:Vector2;
  private __diff:Vector2;

  constructor(shapeIndex:number, from:Vector2, to:Vector2) {
    this.shapeIndex = shapeIndex;
    this.__from = from.clone();
    this.__to = to.clone();
    this.__diff = this.__to.clone().sub(this.__from);
  }

  do() {
    const cloneShape = [ ...state.c_shapes[ this.shapeIndex ]];

    // Remove the last element (which is also the first element) to prevent double translation
    cloneShape.pop(); 

    cloneShape.forEach((i:number):void => {
      const before = state.c_points[i].clone();
      state.c_points[i] = state.c_points[i].clone().add(this.__diff);
      const after = state.c_points[i];
      state.c_pointmap.set(i, after);
    });

    state.updateGrainlinePos( this.shapeIndex, computeCentroid( state.c_shapes[ this.shapeIndex ] ) );
    drawCanvasFromState(state);
  }

  undo() {
    state.c_shapes[ this.shapeIndex ].forEach((i: number) => {
      state.c_points[i].sub(this.__diff); // Reverse the movement
    });
    drawCanvasFromState(state);
  }
}