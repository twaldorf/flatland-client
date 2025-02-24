import { Vector2, Vector2Tuple } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { changeTool } from "../tools/changeTool";
import { createPolygonPlane } from "../../3D/geometry/polygon";
import { useAppState } from "../../UI/store";

export class PathToolClosePathCommand implements Command {
  private path: number[]; // This is the path without the closing point
  private pathIndex: number;
  private shapeIndex: number;

  constructor(path: number[]) {
    this.path = [...path];
    this.pathIndex = -1;
    this.shapeIndex = -1;
  }

  // Close the path and move its points from c_paths to c_shapes
  do() {
    if (this.path.length < 3) return;

    // c_activePath is the path index of the currently drawing/selected path

    // Close path
    state.c_paths[ state.c_activePath ].push(this.path[0]);

    // Save shape and remove shape from paths list
    this.shapeIndex = state.c_shapes.push( state.c_paths.splice( state.c_activePath, 1 )[0] ) - 1;

    // set active shape to the completed shape
    state.c_selected_shapes = [ this.shapeIndex ];

    // Update UI pieces list
    useAppState.getState().addPiece({ name: "piece", shapeIndex: this.shapeIndex });

    // Store index
    this.pathIndex = state.c_activePath;

    // Clear active path
    state.c_activePath = -1;

    changeTool( { type: 'select' } );

    // Demo: create polygon
    const shape = createPolygonPlane(this.path);
    console.log(shape)

    drawCanvasFromState( state );
  }

  undo() {
    // Remove shape from shapes
    state.c_shapes.splice(this.shapeIndex, 1);

    // Send path without closing point to paths, set active index
    state.c_activePath = state.c_paths.push( this.path ) - 1;

    drawCanvasFromState(state);
  }
}