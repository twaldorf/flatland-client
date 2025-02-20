import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";

export class SelectToolDeselectAllCommand implements Command {
  old_selected: number[];
  
  constructor() {
    this.old_selected = state.c_selected;
  }
  do() {
    state.c_selected = [];
    drawCanvasFromState(state);
  }
  undo() {
    state.c_selected = this.old_selected;
  }
}