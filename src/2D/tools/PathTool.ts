import { Vector2 } from "three";
import { Tool, ToolBase } from "../../types";
import { selectionRadius } from "../settings/interface";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";


export class PathTool implements ToolBase {
  readonly name:string = 'path';
  public drawing: boolean;
  private __currentPath: Vector2[];
  private __length: number;

  constructor() {
    this.__currentPath = [];
    this.__length = 0;
  }

  public push(v:Vector2):Vector2[] {
    this.__currentPath.push(v);
    state.c_points.push(v);
    this.__length++;
    return this.__currentPath;
  }
  
  public pop():Vector2 | undefined {
    const result = this.__currentPath.pop();
    if (result) {
      this.__length--;
      return result;
    } else {
      return undefined;
    }
  }

  public selectPoint(i:number):void {
    // if (state.hotkeys.shift) {
      
    // }
    state.c_selected = [];
    state.c_selected.push(i);
    state.cSelecting = true;
    drawCanvasFromState(state);
  }

  public moveSelectedPoint():void {
    
  }

  public getPointByIndex(index:number):Vector2 {
    return this.__currentPath[index];
  }

  public checkPointOverlap(v:Vector2):number | undefined {
    for (let i = 0; i < state.c_points.length; ++i) {
      console.log(state.c_points[i].distanceTo(v), state.c_points.length)
      if (state.c_points[i].distanceTo(v) < selectionRadius) {
        return i;
      }
    }
    return undefined;
  }

  public checkPathOverlap(v:Vector2): boolean {
    return true;
  }
}
