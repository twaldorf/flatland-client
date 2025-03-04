import { Command } from "../../Command";
import { state } from "../../State";
import { LineHit } from "../geometry/lineIntersection";

export class SelectToolDeselectLinesCommand implements Command {
  last:LineHit[];

  constructor() {
    this.last = state.c_selected_lines;
  }

  do() {
    state.c_selected_lines = [];
  }

  undo() {
    state.c_selected_lines = this.last;
  }
}