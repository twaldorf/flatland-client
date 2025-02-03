import { Vector2 } from "three";
import { Tool, ToolBase } from "../../types";
import { selectionRadius } from "../settings/interface";
import { state } from "../../State";
import { drawCanvasFromState, drawSelectionMovePreview, drawSelections } from "../canvas";
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

  // Index of current path within c_paths
  private __currentPathIndex: number;

  // Number of points in the current path
  private __length: number;

  constructor() {
    this.__length = 0;
    this.__currentPathIndex = 0;
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
    
    if (hitIndex !== null && hitIndex > 0) {
      // Case: hit a point which is not the first point
      this.transition({
        type: 'selecting',
        selectedIndices: state.c_selected,
        hitIndex
      });
    } else if ( hitIndex == 0 ) {
      // Case: Close the path and connect to the first point in the shape
      // TODO: this does not work lol
      pushCommand( new PathToolCommand( this, 
        state.c_points[ 
          state.c_paths[ 
            this.__currentPathIndex ][ 0 ]
           ] 
          ) 
        );
      this.transition({
        type: 'idle'
      }); 
    } else {
      // Case: did not hit anything
      this.transition({
        type: 'idle'
      });
    }

    switch (this.__state.type) {
      case "selecting":
        if (state.c_selected.length == 0) {
          // Case: no points are selected
          pushCommand( new PathToolSelectCommand( this.__state.hitIndex ) );
        } else if (state.c_selected.length > 0 && state.shiftDown ) {
          // Case: Points are selected, the user selects additional points
          pushCommand( new PathToolSelectCommand( this.__state.hitIndex ) );
        } else if (this.__indexIsNotSelected( this.__state.hitIndex )) {
          // Case: Points are selected but the user is clicking exclusively on an unselected point
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
    }
    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    
    switch (this.__state.type) {
      case "moving":
        drawSelectionMovePreview(pos);
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
    // drawCanvasFromState(state);
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
  // Moved to common.ts
  public selectPoint(index: number) {
    if (!state.c_selected.includes(index)) {
      state.c_selected.push(index);
      console.log(state.c_selected)
    }
  }

  // Protected, only to be used by Command
  // Moved to common.ts
  public deselect() {
    state.c_selected = [];
    drawCanvasFromState(state);
  }

  // Protected, only to be used by Command
  // Moved to common.ts
  public removePointFromSelection( v: Vector2 ) {
    const i = state.c_selected.findIndex(( index ) => v.equals(state.c_points[ index ]));
    state.c_selected.splice( i, 1 );
  }

  // Moved to common.ts
  public getPointByIndex(index:number):Vector2 {
    return state.c_points[ index ];
  }

  // Moved to common.ts
  private __indexIsNotSelected(index:number):boolean {
    const result = state.c_selected.findIndex((i) => { return i == index });
    return result === -1;
  }

  // Moved to common.ts
  public checkPointOverlap(v:Vector2):number | undefined {
    for (let i = 0; i < state.c_points.length; ++i) {
      console.log(state.c_points[i].distanceTo(v), state.c_points.length)
      if (state.c_points[i].distanceTo(v) < selectionRadius) {
        return i;
      }
    }
    return undefined;
  }

  // Moved to common.ts
  public checkPathOverlap(v:Vector2): boolean {
    return true;
  }
}
