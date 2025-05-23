import { Path, Vector2 } from "three";
import { Command } from "../../Command";
import { state } from '../../State';
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { PathTool } from "../tools/PathTool";
import { rad } from "../settings/interface";
import { useAppState } from "../../UI/ViewState";

export class PathToolCommand implements Command {
  __point:Vector2;
  __index:number;
  __pathIndex:number;
  tool:PathTool;

  constructor(tool:PathTool, point:Vector2) {
    this.tool = tool;
    this.__point = point;
    this.__index = -1;
    this.__pathIndex = -1;
  }

  do() {
    const indices = this.tool.addPointToCurrentPath( this.__point );
    this.__index = indices.pointIndex;
    this.__pathIndex = indices.pathIndex;

    useAppState.getState().addShapePoint(this.__point);
  }

  undo() {
    this.tool.removePointFromPath( this.__index, this.__pathIndex );
  }

}