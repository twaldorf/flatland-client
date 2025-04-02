import { Path, Vector2 } from "three";
import { Command } from "../../../Command";
import { useAppState } from "../../../UI/store";
import { PathTool } from "../../tools/PathTool";
import { state } from "../../../State";
import { drawCanvasFromState } from "../../rendering/canvas";

export class GenericUpdatePointCommand implements Command {
  point:Vector2;
  lIndex:number;
  gIndex:number;
  pathIndex:number;
  oldPoint:Vector2;
  tool:PathTool | null;

  constructor(index: number, point:Vector2) {
    this.tool = null;
    this.point = point;
    this.lIndex = index;
    this.pathIndex = state.c_activePath;

    this.gIndex = state.c_paths[ this.pathIndex ][ this.lIndex ];

    this.oldPoint = state.c_points[this.gIndex];
  }

  do() {
    state.c_pointmap.set(this.gIndex, this.point);
    state.c_points[ this.gIndex ] = this.point;
    drawCanvasFromState(state);
  }

  undo() {
    state.c_pointmap.set(this.gIndex, this.oldPoint);
  }

}