import { Path, Vector2 } from "three";
import { Command } from "../../../Command";
import { PathTool } from "../../tools/PathTool";
import { state } from "../../../State";
import { useAppState } from "../../../UI/AppState";

export class GenericAddPointCommand implements Command {
  __point:Vector2;
  __index:number;
  __pathIndex:number;
  tool:PathTool | null;

  constructor(index: number, point:Vector2) {
    this.tool = null;
    this.__point = point;
    this.__index = index;
    this.__pathIndex = -1;
  }

  do() {
    switch (state.tool.name) {
      case 'path':
        const t = state.tool as PathTool;
        const indices = t.insertPointIntoCurrentPath( this.__index, this.__point );
        this.__index = indices.pointIndex;
        this.__pathIndex = indices.pathIndex;
        
        useAppState.getState().addShapePoint(this.__point);
    }
  }

  undo() {
    this.tool?.removePointFromPath( this.__index, this.__pathIndex );
  }

}