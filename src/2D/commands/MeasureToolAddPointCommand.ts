import { Vector2 } from "three";
import { state } from "../../State";
import { Command } from "../../Command";
import { drawCanvasFromState } from "../rendering/canvas";

export class MeasureToolAddPointCommand implements Command {

  pos = new Vector2();
  currentPathIndex:number;
  key:string;
  
  constructor(pos:Vector2, pathIndex:number) {
    this.pos.copy(pos);
    this.currentPathIndex = pathIndex;
    this.key = String.fromCharCode(65 + state.c_measure_points.size);
  }

  do() {
    state.c_measure_points.set(this.key, this.pos);
    if (!state.c_measure_paths[ this.currentPathIndex ]) {
      state.c_measure_paths[ this.currentPathIndex ] = [];
    }
    state.c_measure_paths[ this.currentPathIndex ].push(this.key)
    drawCanvasFromState(state)
  }

  undo() {
    state.c_measure_points.delete(this.key);
  }

}