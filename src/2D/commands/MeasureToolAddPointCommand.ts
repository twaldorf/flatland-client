import { Vector2 } from "three";
import { state } from "../../State";
import { Command } from "../../Command";

export class MeasureToolAddPointCommand implements Command {

  pos:Vector2;
  key:string;
  
  constructor(pos:Vector2) {
    this.pos = pos;
    this.key = String.fromCharCode(65 + state.c_measure_points.size);
  }

  do() {
    state.c_measure_points.set(this.key, this.pos);
  }

  undo() {
    state.c_measure_points.delete(this.key);
  }

}