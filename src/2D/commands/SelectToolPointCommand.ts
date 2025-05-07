import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";

export class SelectToolPointCommand implements Command {
  private __pointId:string;
  private __index:number;

  constructor(pointId:string) {
    this.__pointId = pointId;
    this.__index = state.c_selectedPoints.length - 1;
  }

  do() {
    state.c_selectedPoints.push(this.__pointId);
    drawCanvasFromState(state);
  }

  undo() {
    state.c_selectedPoints.splice(this.__index, 1);
    drawCanvasFromState(state);
  }

}