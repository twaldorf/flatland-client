import { Vector2 } from "three";
import { Tool, ToolBase } from "../../types";
import { selectionRadius } from "../settings/interface";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";
import { pushCommand } from "../../Command";
import { PathToolMovePointCommand } from "../commands/PathToolMovePointCommand";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { findNearestPoint } from "../geometry/findNearestPoint";
import { PathToolCommand } from "../commands/PathToolCommand";
import { PathToolSelectCommand } from "../commands/PathToolSelectCommand";
import { PathToolDeselectCommand } from "../commands/PathToolDeselectCommand";

export type PathToolState = 
  | { type: "idle" }
  | { type: "drawing"; currentPathIndex: number }
  | { type: "hovering"; hoveredIndex: number }
  | { type: "moving"; selectedIndices: number[]; startPos: Vector2 }
  | { type: "selecting"; selectedIndices: number[], hitIndex: number; }

export class PathTool implements ToolBase {
  // Path tool state object stores tool mechanical state, no data
  private __state:PathToolState = { type: "idle" };

  // Tool name
  readonly name:string = 'path';

  // Vector of indices used in the current path
  // private __currentPath: number[];

  // Number of points in the current path
  private __length: number;

  constructor() {
    this.__length = 0;
  }

  public initializeEvents() {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  // ## Path drawing command interface
  // Add a point to the current path being drawn
  // Return the index of the point in the c_points array
  // Protected, this is only to be used by a Command do() member!
  public addPointToCurrentPath( v:Vector2 ):{ pointIndex:number, pathIndex:number } {
    const pointIndex = state.c_points.push( v ) - 1;

    // Already drawing, continue adding points to the current path
    if (this.__state.type == 'drawing') {
      state.c_paths[ this.__state.currentPathIndex ].push( pointIndex );
    }

    if (this.__state.type == 'idle') {
      const path = [ pointIndex ];
      const pathIndex = state.c_paths.push( path ) - 1;

      this.transition({
        type: "drawing",
        currentPathIndex: pathIndex
      })
    }
    drawCanvasFromState(state);
    return { pointIndex, pathIndex: this.__state.currentPathIndex };
  }

  // Protected, to be used by a Command
  public removePointFromPath( i:number, pi:number ):void {
    const pointInPathIndex = state.c_paths[ pi ].findIndex( (c) => c == i );
    state.c_points.splice( i, 1 );
    state.c_paths[ pi ].splice( pointInPathIndex, 1 );
    drawCanvasFromState(state);
  }

  // Path tool state management
  private transition(newState: PathToolState) {
    console.log(`PathTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Path tool event management
  private onMouseDown(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    const hitIndex = findNearestPoint(pos, state.c_points);
    
    if (hitIndex !== null) {
      this.transition({
        type: 'selecting',
        selectedIndices: state.c_selected,
        hitIndex
      });
    } else {
      this.transition({
        type: 'idle'
      })
    }

    switch (this.__state.type) {
      case "selecting":
        if (state.c_selected.length == 0) {
          pushCommand( new PathToolSelectCommand( this.__state.hitIndex ) );
        } else if (state.c_selected.length > 0 && state.shiftDown ) {
          pushCommand( new PathToolSelectCommand( this.__state.hitIndex ) );
        } else if (this.__indexIsNotSelected( this.__state.hitIndex )) {
          pushCommand( new PathToolDeselectCommand() );
          pushCommand( new PathToolSelectCommand( this.__state.hitIndex ) );
        }
        break;

      case "idle":
        if (state.c_selected.length == 0) {
          pushCommand( new PathToolCommand(this, pos) );
        } else {
          pushCommand( new PathToolDeselectCommand() );
        }
        break;
        // case "drawing":
        // case "hovering":
        // case "moving":
    }
    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    
    switch (this.__state.type) {
      case "moving":
        break;

      case "selecting":
        this.transition({
          type: "moving",
          selectedIndices: state.c_selected,
          startPos: pos,
        });
        break;

      case "idle":
        if (Math.random() < .1) {
          const hitIndex = findNearestPoint(pos, state.c_points);
          if (hitIndex !== null) {
            this.transition({ type: "hovering", hoveredIndex: hitIndex });
          }
        }
        break;
    }
    drawCanvasFromState(state);
  }

  private onMouseUp(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    switch (this.__state.type) {
      case "moving":
        pushCommand(
          new PathToolMovePointCommand(
            this.__state.selectedIndices,
            this.__state.startPos,
            pos
          )
        );
        break;

      case "selecting":
        const nearPoint = findNearestPoint(pos, state.c_points);
        if (nearPoint != null && !state.shiftDown) {
          state.c_selected = [ nearPoint ];
        }
        break;
    }
    this.transition({ type: "idle" });
    drawCanvasFromState(state);
  }

  // Protected, only to be used by Command
  public selectPoint(index: number) {
    if (!state.c_selected.includes(index)) {
      state.c_selected.push(index);
      console.log(state.c_selected)
    }
  }

  // Protected, only to be used by Command
  public deselect() {
    state.c_selected = [];
    drawCanvasFromState(state);
  }

  // Protected, only to be used by Command
  public removePointFromSelection( v: Vector2 ) {
    const i = state.c_selected.findIndex(( index ) => v.equals(state.c_points[ index ]));
    state.c_selected.splice( i, 1 );
  }

  public getPointByIndex(index:number):Vector2 {
    return state.c_points[ index ];
  }

  private __indexIsNotSelected(index:number):boolean {
    const result = state.c_selected.findIndex((i) => { return i == index });
    return result === -1;
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
