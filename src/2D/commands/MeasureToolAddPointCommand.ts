import { Vector2 } from "three";
import { state } from "../../State";
import { Command } from "../../Command";

export class MeasureToolAddPointCommand implements Command {

  pos:Vector2;
  last:number[];
  
  constructor(pos:Vector2) {
    this.pos = pos;
    this.last = state.c_measure_path;
  }

  do() {
    const index = state.c_points.push(this.pos) - 1;
    state.c_measure_path.push(index);
  }

  undo() {
    state.c_measure_path = this.last;
  }

}