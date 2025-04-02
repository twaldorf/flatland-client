import { Path, Vector2 } from "three";
import { Command } from "../../../Command";
import { useAppState } from "../../../UI/store";
import { PathTool } from "../../tools/PathTool";
import { state } from "../../../State";

export class GenericDeletePointCommand implements Command {
  private pathIndex: number; // Index of the active path in c_paths
  private pointIndex: number; // Index of the point within the path array
  private previousPathState: number[]; // Stores the original state of the path
  
  /**
  @param {number} pointIndex - Index of the point within the current path
  */
  constructor( pointIndex: number ) {
    // Pick active path, as with all generic commands
    this.pathIndex = state.c_activePath;
    
    // Find the right globalPointIndex from the current path
    this.pointIndex = state.c_paths[ this.pathIndex ][ pointIndex ];

    // Store previous state
    this.previousPathState = [ ...state.c_paths[ this.pathIndex ] ];
  }

  do() {
    const path = state.c_paths[ this.pathIndex ];

    // Ensure the path exists and contains the point
    if ( !path || path.length <= 1 ) return; // Prevent removing too many points

    state.c_paths[this.pathIndex] = path.filter( ( value, index ) => value !== this.pointIndex );
    state.c_pointmap.delete(this.pointIndex);
  }

  undo() {
    state.c_paths[ this.pathIndex ] = [ ...this.previousPathState ];
  }

}