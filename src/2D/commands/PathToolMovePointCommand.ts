import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class PathToolMovePointCommand implements Command {
  private indices:Array<number>;
  private __from:Vector2;
  private __to:Vector2;

  constructor(indices:Array<number>, from:Vector2, to:Vector2) {
    console.log(to, from)
     this.indices = indices;
     this.__from = from.clone();
     this.__to = to.clone();
  }

  do() {
    const sum = this.__to.sub(this.__from);
    this.indices.map((i:number):void => {
      console.log(sum)
      state.c_points[i].add(sum);
    });
    drawCanvasFromState(state);
  }

  undo() {

  }
}