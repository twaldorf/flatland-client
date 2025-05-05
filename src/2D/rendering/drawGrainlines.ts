import { state } from "../../State";
import { getBuffer } from "./getBuffer";

// export function drawGrainlines() {
  // const { canvas, context } = getBuffer('grainlines');
  // canvas.width = state.canvas.width;
  // canvas.height = state.canvas.height;

//   state.grainlines.forEach((grainline) => {
    // context.moveTo(grainline.x, grainline.y);
    // context.lineTo(grainline.x + Math.cos(grainline.angle), grainline.y + Math.sin(grainline.angle));
    // context.stroke();
//   });
// }

export function drawGrainOnShape(shapeIndex: number, context: OffscreenCanvasRenderingContext2D) {
  // const { canvas, context } = getBuffer('grainlines');
  // canvas.width = state.canvas.width;
  // canvas.height = state.canvas.height;

  const grainline = state.c_grainlines.get(shapeIndex);
  if (grainline) {
    context.moveTo(grainline.position.x, grainline.position.y);
    context.lineTo(
      grainline.position.x + Math.cos(grainline.angle - (2 * Math.PI + Math.PI/2)) * 100, 
      grainline.position.y + Math.sin(grainline.angle - (2 * Math.PI + Math.PI/2)) * 100
    );
    context.stroke();
  }
}