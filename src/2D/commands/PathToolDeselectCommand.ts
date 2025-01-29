import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class PathToolDeselectCommand implements Command {
  private __selections;

  constructor() {
    this.__selections = state.c_selected;
  }

  do() {
    state.tool.deselect();
  }

  undo() {
    this.__selections.forEach((index:number) => {
      state.tool.selectPoint(index);
    })
  }

}