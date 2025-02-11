import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class PathToolRemovePointCommand implements Command {
  private pathIndex: number; // Index of the active path in c_paths
  private pointIndex: number; // Index of the point within the path array
  private previousPathState: number[]; // Stores the original state of the path

  constructor( pathIndex: number, pointIndex: number ) {
    this.pathIndex = pathIndex;
    this.pointIndex = pointIndex;
    this.previousPathState = [ ...state.c_paths[ this.pathIndex ] ]; // Store previous state
  }

  do() {
    const path = state.c_paths[ this.pathIndex ];

    // Ensure the path exists and contains the point
    if ( !path || path.length <= 1 ) return; // Prevent removing too many points
    console.log(`Path index ${this.pathIndex} PointIndex ${this.pointIndex} Path: ${path}`)

    state.c_paths[this.pathIndex] = path.filter( ( value, index ) => value !== this.pointIndex );
    console.log(`Path index ${this.pathIndex} PointIndex ${this.pointIndex} Path: ${path}`)
    state.c_pointmap.delete(this.pointIndex);

    drawCanvasFromState(state);
  }

  undo() {
    state.c_paths[ this.pathIndex ] = [ ...this.previousPathState ];
    drawCanvasFromState(state);
  }
}
