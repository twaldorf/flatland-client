import { State } from "../../types";
import { getBuffer } from "./getBuffer";

export function drawMeasurements(state:State) {
  const { context, canvas } = getBuffer('measurements');
  const points = state.c_measure_points.values;
  canvas.width = 
  for (const key of state.c_measure_points.keys()) {
    context
  }
}