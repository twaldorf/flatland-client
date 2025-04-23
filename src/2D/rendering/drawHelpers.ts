import { state } from "../../State";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { computeCentroid } from "../geometry/centroid";
import { getBuffer } from "./getBuffer";

export function drawHelpers() {
  console.log('drawing helpers')
  const { canvas, context } = getBuffer('helpers');
  if (state.tool.name === 'grainline') {
    canvas.width = state.canvas.width;
    canvas.height = state.canvas.height;
    context.fillStyle = 'black';
    const rad = 10;
    state.c_selected_shapes.forEach((shapeIndex:number) => {
      const shape = state.c_shapes[shapeIndex];
      const centroid = computeCentroid(shape);
      context.beginPath();
      context.arc(centroid.x, centroid.y, rad, 0, 2 * Math.PI);
      context.fill();
      // state.context.drawImage(canvas, centroid.x, centroid.y);
    });
    state.context.drawImage(canvas, 0, 0);
  }
}

export function applyHelpers() {
  const obj = state.c_buffers.get('helpers');
  if (obj && obj.canvas.width > 0) state.context.drawImage(obj.canvas, 0, 0);
}