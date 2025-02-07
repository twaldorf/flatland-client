import { Vector2, Vector2Tuple } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class PathToolMovePointCommand implements Command {
  private indices:Array<number>;
  private __from:Vector2;
  private __to:Vector2;
  private __diff:Vector2;

  constructor(indices:Array<number>, from:Vector2, to:Vector2) {
    this.indices = indices;
    this.__from = from.clone();
    this.__to = to.clone();
    this.__diff = this.__to.clone().sub(this.__from);
  }

  do() {
    this.indices.forEach((i:number):void => {
      state.c_points[i].add(this.__diff);
    });
    drawCanvasFromState(state);
  }

  undo() {
    this.indices.forEach((i: number) => {
      state.c_points[i].sub(this.__diff); // Reverse the movement
    });
    drawCanvasFromState(state);
  }
}
