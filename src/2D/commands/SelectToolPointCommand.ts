import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";

export class SelectToolPointCommand implements Command {
  private __index:number;

  constructor(index:number) {
    this.__index = index;
  }

  do() {
    state.c_selected.push(this.__index);
    drawCanvasFromState(state);
  }

  undo() {
    state.c_selected.pop();
  }

}