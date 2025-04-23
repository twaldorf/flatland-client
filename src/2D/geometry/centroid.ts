import { Vector2 } from "three";
import { state } from "../../State";

export function computeCentroid(indices: number[]): Vector2 {
  if (indices.length === 0) return new Vector2();

  const centroid = new Vector2();

  for (const index of indices) {
    const point = state.c_points[index];
    centroid.add(point);
  }

  centroid.divideScalar(indices.length);
  return centroid;
}
