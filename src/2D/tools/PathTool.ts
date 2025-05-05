import { Vector, Vector2 } from "three";
import { Geometry2D, State, Tool, ToolBase } from "../../types";
import { selectionRadius } from "../settings/interface";
import { genGeoId, state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { drawDrawPreview } from "../rendering/drawDrawPreview";
import { drawSelectionMovePreview } from "../rendering/drawSelectionMovePreview";
import { pushCommand } from "../../Command";
import { PathToolMovePointCommand } from "../commands/PathToolMovePointCommand";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { findNearestGeometryPoint, findNearestPoint } from "../geometry/findNearestPoint";
import { PathToolCommand } from "../commands/PathToolCommand";
import { PathToolSelectCommand } from "../commands/PathToolSelectCommand";
import { PathToolDeselectCommand } from "../commands/PathToolDeselectCommand";
import { PathToolClosePathCommand } from "../commands/PathToolClosePathCommand";
import { PathToolRemovePointCommand } from "../commands/PathToolRemovePointCommand";
import { useAppState } from "../../UI/store";
import { PathToolAddBezierCommand } from "../commands/PathToolAddBezierCommand";

export type PathToolState = 
  | { type: "idle" }
  | { type: "drawing"; currentPathIndex: number }
  | { type: "drawing new point"; currentPathIndex: number, newPointIndex: number, mouseDownPos: Vector2 }
  | { type: "moving new point"; index: number, startPos: Vector2 }
  // | { type: "hovering"; hoveredIndex: number } // hovering will have to be handled elsewhere
  | { type: "moving"; selectedIndices: number[]; startPos: Vector2 }
  | { type: "selecting"; selectedIndices: number[], hitIndex: number; }

export class PathTool implements ToolBase {
  // Path tool state object stores tool mechanical state, no data
  readonly __state:PathToolState = { type: "idle" };

  // Tool name
  readonly name:string = 'path';

  // Index of current path within c_paths
  private __currentPathIndex: number;

  // Current geometryId
  public __geometryId: string | null = null;

  // Number of points in the current path
  private __length: number;
  
  private setPointer = useAppState.getState().setPointer;
  
  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this)
  } 

  constructor() {
    this.__length = 0;
    this.__currentPathIndex = -1;
  }

  // Not implemented: stateful tool swapping (for redo)
  public applyState (state: ToolBase['state']):void {
    this.__state = state;
  };

  public setGeometryId(id:string) {
    this.__geometryId = id;
  }

  public initializeEvents() {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.__listeners.down);
    canvas.addEventListener("mousemove", this.__listeners.move);
    canvas.addEventListener("mouseup", this.__listeners.up);
  }

  public dismountEvents() {
    state.canvas.removeEventListener('mousedown', this.__listeners.down);
    state.canvas.removeEventListener("mousemove", this.__listeners.move);
    state.canvas.removeEventListener("mouseup", this.__listeners.up);
  }

  // ## Path drawing command interface
  // Add a point to the current path being drawn
  // Return the index of the point in the c_points array
  // Protected, this is only to be used by a Command do() member!
  public addPointToCurrentPath( v:Vector2 ):{ pointIndex:number, pathIndex:number } {

    // Set active path
    state.c_activePath = this.__currentPathIndex;

    // Index of point in global point array
    const pointIndex = state.c_points.push( v ) - 1;

    // Add the point to the active point array
    state.c_pointmap.set(pointIndex, v);
    
    // Index of current path in global path array
    const pathIndex = this.__currentPathIndex;

    if (state.c_paths[ pathIndex ]) {
      // Add the point to the path
      state.c_paths[ pathIndex ].push(pointIndex);
    } else {
      // Create a new path and add the point to it
      this.__currentPathIndex = state.c_paths.push([ pointIndex ]) - 1;
    }
    drawCanvasFromState(state);
    return { pointIndex, pathIndex };
  }

  // To be used only by a Command
  /**
  @param {number} i - The index of the point within the shape or path
  @param {Vector2} v - The point to be inserted into the shape or path
  */
  public insertPointIntoCurrentPath( i:number, v:Vector2 ): { pointIndex: number, pathIndex: number } {
    // Set active path
    state.c_activePath = this.__currentPathIndex;

    // Index of point in global point array
    const gPointIndex = state.c_points.push( v ) - 1;

    // Add the point to the active point array
    state.c_pointmap.set(gPointIndex, v);
    
    // Index of current path in global path array
    const pathIndex = this.__currentPathIndex;

    if (state.c_paths[ pathIndex ]) {
      // Add the point to the path
      state.c_paths[ pathIndex ].splice(i, 0, gPointIndex);
    } else {
      // Create a new path and add the point to it
      this.__currentPathIndex = state.c_paths.push([ gPointIndex ]) - 1;
    }

    return { pointIndex: gPointIndex, pathIndex };
  }

  // To be used by a Command
  /**
  @param {number} i - The index of the point within the global point array
  @param {number} pi - The index of the path within the global path array
  */
  public removePointFromPath( i:number, pi:number ):void {
    const pointInPathIndex = state.c_paths[ pi ].findIndex( (c) => c === i );
    console.log(i, pi, pointInPathIndex );
    state.c_paths[ pi ].splice( pointInPathIndex, 1 );
    state.c_pointmap.delete(i);
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
    state.pointer = pos;

    var hitIndex = null;
    if (this.__geometryId) {
      hitIndex = findNearestGeometryPoint(pos, [state.c_geometryMap.get(this.__geometryId) as Geometry2D]);
    }

    switch (this.__state.type) {
      case "drawing":
        // Case: Close the path and connect to the first point in the shape if there three or more points
        if (hitIndex && hitIndex == state.c_geometryMap.get(this.__geometryId)?.pointIds[0]) { 
          pushCommand( new PathToolClosePathCommand( state.c_paths[this.__currentPathIndex] ) );
          this.transition({
            type: 'idle'
          }); 
        } else if ( hitIndex != null && state.c_paths[ this.__currentPathIndex ].indexOf( hitIndex ) > -1 ) {
          pushCommand( new PathToolRemovePointCommand( this.__currentPathIndex, hitIndex ));
        } else {
          // TODO: simply do not do this
          // Why: we'd like to be able to make the first point a bezier. Perhaps every point is actually a bezier?? that would be quite clean tbh let's try it
          // pushCommand( new PathToolCommand(this, pos) );
          this.transition({
            type: "drawing new point",
            currentPathIndex: this.__currentPathIndex,
            newPointIndex: state.c_points.length,
            mouseDownPos: pos,
          });
        }

        break;

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
        } else if (state.c_selected.length == 1 && state.c_selected[0] == hitIndex) {
          pushCommand(new PathToolRemovePointCommand( this.__currentPathIndex, hitIndex ) );
        }

        break;

      case "idle":
        if (hitIndex != null) {
          // Select the point
          this.transition( {
            type: 'selecting', 
            selectedIndices: [ hitIndex ],
            hitIndex
          });
        } else {
          // Begin drawing
          // This logic is being removed by bezier functionality
          // TODO: Add new point draw preview bubble
          this.__currentPathIndex = state.c_shapes.length;
          // pushCommand( new PathToolCommand(this, pos) );
          this.transition( {
            type: 'drawing new point',
            currentPathIndex: this.__currentPathIndex,
            newPointIndex: 0, // TODO: resolve this
            mouseDownPos: pos,
          } );
          // Clear selected shapes, the incoming path is FIGURATIVELY the 'active' path
          state.c_selected_shapes = [];
        }
        break;
    }

    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    state.pointer = pos;

    this.setPointer(state.pointer);
    
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

      case "drawing new point":
        // update draw preview
        break;

      case "drawing":
        if (state.c_paths.length > 0) {          
          const lastPointIndexWithinPath = state.c_paths[this.__currentPathIndex]?.length - 1;
          const pointIndex = state.c_paths[this.__currentPathIndex][lastPointIndexWithinPath];
          // console.log(lastPointIndexWithinPath, pointIndex);
          if (state.c_points[pointIndex]) {
            drawDrawPreview(state.c_points[pointIndex], pos);
          }
        }

      case "idle":
        if (Math.random() < .1) {
          const hitIndex = findNearestPoint(pos, state.c_points);
          // if (hitIndex !== null) {
          //   this.transition({ type: "hovering", hoveredIndex: hitIndex });
          // }
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
        this.transition({ type: "idle" });
        break;

      case "moving new point":
        pushCommand(
          new PathToolMovePointCommand(
            [ this.__state.index ],
            this.__state.startPos,
            pos
          )
        );
        this.transition({ type: "drawing", currentPathIndex: this.__currentPathIndex }); 
        break;

      case "selecting":
        const nearPoint = findNearestPoint(pos, state.c_points);
        if (nearPoint != null && !state.shiftDown) {
          state.c_selected = [ nearPoint ];
        }
        // this.transition({ type: "idle" }); // How important is this?
        break;

      case "drawing new point":
        // Move to draw Preview logic
        // Case: this is the first point in the path
        // var from;
        // if (this.__length == 0) {
        //   from = state.c_points[ this.__state.newPointIndex ];
        //   console.log('FROM', from)
        // } else {
        //   // Case: this is not the first point in the path, get the position of the last point
        //   from = state.c_points[ state.c_paths[ this.__currentPathIndex ][ this.__length] ];
        // }

        if (this.__geometryId == null) {
          console.log('NEW GEOMETRY')
          this.__geometryId = genGeoId();
          pushCommand(new PathToolAddBezierCommand(this.__geometryId, this.__state.mouseDownPos, pos));
        } else {
          const geo = state.c_geometryMap.get(this.__geometryId);
          if (geo) {
            const previousPointId = geo.pointIds[geo.pointIds.length - 1];
            const previousPoint = state.c_pointsMap.get(previousPointId);
            if (previousPoint) {
              pushCommand(new PathToolAddBezierCommand(this.__geometryId, this.__state.mouseDownPos, pos, previousPoint)); 
            }
          }
        }

        this.transition({
          type: "drawing",
          currentPathIndex: this.__currentPathIndex
        })
        break;
    }

    drawCanvasFromState(state);
  }

  get state():PathToolState {
    return this.__state;
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
    this.__currentPathIndex = -1;
    this.__length = -1;
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
