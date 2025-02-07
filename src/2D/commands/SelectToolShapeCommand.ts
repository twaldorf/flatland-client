import { Command } from "../../Command";
import { state } from "../../State";

export class SelectToolShapeCommand implements Command {
  private shapeIndex: number;
  private previousSelection: number | null;

  constructor(shapeIndex: number) {
    this.shapeIndex = shapeIndex;
    this.previousSelection = state.selectedShape;
  }

  do() {
    state.selectedShape = this.shapeIndex;
    console.log(`Shape ${this.shapeIndex} selected.`);
  }

  undo() {
    state.selectedShape = this.previousSelection;
    console.log(`Selection reverted to shape ${this.previousSelection}`);
  }
}
