import { Command } from "../../Command";
import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";
import { drawCanvasFromState } from "../rendering/canvas";

export class SelectToolDeselectAllCommand implements Command {
  old_selected: number[];
  old_selected_shapes: number[];
  old_selected_lines: LineHit[];
  
  constructor() {
    this.old_selected = state.c_selected;
    this.old_selected_lines = state.c_selected_lines;
    this.old_selected_shapes = state.c_selected_shapes;
  }
  
  do() {
    state.c_selected = [];
    state.c_selected_lines = [];
    state.c_selected_shapes = [];
    drawCanvasFromState(state);
  }
  
  undo() {
    state.c_selected = this.old_selected;
    state.c_selected_lines = this.old_selected_lines;
    state.c_selected_shapes = this.old_selected_shapes;
  }
}