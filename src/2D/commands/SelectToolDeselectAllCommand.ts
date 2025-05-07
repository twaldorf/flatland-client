import { Command } from "../../Command";
import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";
import { drawCanvasFromState } from "../rendering/canvas";

export class SelectToolDeselectAllCommand implements Command {
  old_selected: string[];
  old_selected_shapes: string[];
  old_selected_lines: LineHit[];
  
  constructor() {
    this.old_selected = state.c_selectedPoints;
    this.old_selected_lines = state.c_selected_lines;
    this.old_selected_shapes = state.c_selectedGeometries;
  }
  
  do() {
    state.c_selectedPoints = [];
    state.c_selected_lines = [];
    state.c_selectedGeometries = [];
    drawCanvasFromState(state);
  }
  
  undo() {
    state.c_selectedPoints = this.old_selected;
    state.c_selected_lines = this.old_selected_lines;
    state.c_selectedGeometries = this.old_selected_shapes;
  }
}