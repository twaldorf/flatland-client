import { Vector2 } from "three";
import { State } from "../../types";
import { getMapShapeDimensions } from "../geometry/boundingBox";
import { getBuffer } from "./getBuffer";
import { cf_canvas_to_inch } from "../settings/factors";
import { state } from "../../State";

export function drawMeasurements(state:State) {

  if (state.c_measure_points.size < 2) {
    //bail if there are no measurements
    return;
  }

  const { context, canvas } = getBuffer('measurements');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  state.c_measure_paths.forEach((pathArr:string[]) => {
    const p0 = state.c_measure_points.get(pathArr[0]) as Vector2;
    context.moveTo(p0.x, p0.y);
    
    var last = p0;
      for (let i = 1; i < pathArr.length; ++i) {
        const p = state.c_measure_points.get(pathArr[i]) as Vector2;
        context.font = 'bold 22px sans-serif';
        const midpoint = new Vector2();
        midpoint.addVectors(p, last).divideScalar(2);
        context.fillText(`${Math.round(last.distanceTo(p)) / cf_canvas_to_inch / 2}in`, midpoint.x, midpoint.y);
        context.lineTo(p.x, p.y);
        last = p;
      }
    })
  
  context.lineWidth = 4;
  context.strokeStyle = '#ffaa55'
  context.stroke();

  state.context.drawImage(canvas, 0, 0);
}

export function applyMeasurements() {
  const obj = state.c_buffers.get('measurements');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}
