import { Vector2 } from "three";
import { state } from "../../State";
import { State } from "../../types";
import { rad } from "../settings/interface";
import { getBuffer } from "./getBuffer";

// Assuming only one active object, draw it
// TODO: draw a tree of paths, or rather a 2d array of paths
export const drawPoints = (state: State) => {

  const { canvas, context } = getBuffer('points');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  drawActivePoints();

  // Draw selected shape points
  state.c_selected_shapes.forEach((shapeIndex) => {
    state.c_shapes[shapeIndex].forEach((index) => {
      drawActiveShapePoint(index);
    })
  });

  state.context.drawImage(canvas, 0, 0);

  function drawActiveShapePoint(index:number) {
    const e = state.c_points[index];
    context.fillStyle = 'black';
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(e.x - rad / 2 + 2, e.y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    context.fill();
    context.stroke();  
  }

  function drawPoint(index:number) {
    const e = state.c_points[index];
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(e.x - rad / 2 + 2, e.y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    context.fill();
    context.stroke(); 
  }

  function drawActivePoints() {
    // Draw generic active points
    state.c_pointmap.forEach((e: Vector2) => {
      context.fillStyle = 'white';
      context.strokeStyle = 'black';
      context.beginPath();
      context.arc(e.x - rad / 2 + 2, e.y - rad / 2 + 2, rad, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    });
  }
};


export function applyPoints() {
  const obj = state.c_buffers.get('points');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}
