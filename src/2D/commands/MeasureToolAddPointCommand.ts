import { Vector2 } from "three";
import { state } from "../../State";
import { Command } from "../../Command";
import { drawCanvasFromState } from "../rendering/canvas";

export class MeasureToolAddPointCommand implements Command {

  pos = new Vector2();
  key:string;
  
  constructor(pos:Vector2) {
    this.pos.copy(pos);
    this.key = String.fromCharCode(65 + state.c_measure_points.size);
  }

  do() {
    state.c_measure_points.set(this.key, this.pos);
    console.log(state.c_measure_points.size)
    drawCanvasFromState(state)
  }

  undo() {
    state.c_measure_points.delete(this.key);
  }

}