import { Command } from "../../Command";
import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";
import { drawCanvasFromState } from "../rendering/canvas";


export class SelectToolSelectLineCommand implements Command {
  private lineHit: LineHit;
  private previousSelection: LineHit[];

  constructor(lineHit: LineHit) {
    this.lineHit = lineHit;
    this.previousSelection = state.c_selected_lines;
  }

  do() {
    state.c_selected_lines = [ ...state.c_selected_lines, this.lineHit ];

  console.log('state.c_selected_lines', state.c_selected_lines)
  drawCanvasFromState(state);
  }

  undo() {
    state.c_selected_lines = this.previousSelection;
  }
}
