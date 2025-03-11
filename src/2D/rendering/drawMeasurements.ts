import { State } from "../../types";
import { getMapShapeDimensions } from "../geometry/boundingBox";
import { getBuffer } from "./getBuffer";

export function drawMeasurements(state:State) {

  console.log(state.c_measure_points.size)
  if (state.c_measure_points.size < 2) {
    //bail if there are no measurements
    console.log('BAIL')
    return;
  }

  const { context, canvas } = getBuffer('measurements');

  const dimensions = getMapShapeDimensions(state.c_measure_points);

  const points = state.c_measure_points.values().toArray();

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  for (let i = 0; i < state.c_measure_points.size - 1; ++i) {
    context.moveTo(points[i].x, points[i].y);
    context.lineTo(points[i + 1].x, points[i + 1].y);
    context.fillRect(points[i].x, points[i].y, 5, 5);
  }

  context.lineWidth = 10;
  context.stroke();


  state.context.drawImage(canvas, 0, 0);
  console.log('draw image')
}