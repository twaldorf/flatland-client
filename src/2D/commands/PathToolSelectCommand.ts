import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class PathToolSelectCommand implements Command {
  private __index:number;
  private __point:Vector2;

  constructor(index:number) {
    this.__index = index;
    this.__point = state.tool.getPointByIndex(index);
  }

  do() {
    state.context.fillStyle = 'blue';
    state.context.fillRect(this.__point.x, this.__point.y, 10, 10);
    // In PathTool.ts
    state.tool.selectPoint(this.__index);
  }

  undo() {
    state.tool.removePointFromSelection(this.__point);
  }

}