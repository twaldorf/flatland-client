import { Command } from "../../Command"
import { state } from "../../State"
import { drawCanvasFromState, redrawCanvas } from "../rendering/canvas";


export class DeleteShapeCommand implements Command {

  __shapeIndex: number;

  constructor(shapeIndex:number) { this.__shapeIndex = shapeIndex }

  do() {
    state.c_shapes[this.__shapeIndex].forEach((pointIndex:number) => {
      // Delete points from the active point map
      state.c_pointmap.delete(pointIndex);
    });

    // Remove shape from the list of shapes
    state.c_shapes.splice(this.__shapeIndex, 1);
    console.log('deleted shape ', this.__shapeIndex
    )
    drawCanvasFromState(state)
  }
  undo() {
    // TODO: Implement DeleteShapeCommand undo
    console.log("Undo function for DeleteshapeCommand not implemented")
  }
}