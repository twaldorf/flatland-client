import { Command } from "../../Command";
import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";


export class SelectToolSelectLineCommand implements Command {
  private lineHit: LineHit;
  private previousSelection: LineHit[];

  constructor(lineHit: LineHit) {
    this.lineHit = lineHit;
    this.previousSelection = state.c_selected_lines;
  }

  do() {
    state.c_selected_lines = [ this.lineHit ];
  }

  undo() {
    state.c_selected_lines = this.previousSelection;
  }
}
