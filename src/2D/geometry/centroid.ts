import { Vector2 } from "three";
import { state } from "../../State";
import { BezierPoint } from "../../types";

export function computeCentroid(pointIds: string[]): Vector2 {
  if (pointIds.length === 0) return new Vector2(0,0); // this should fail

  const centroid = new Vector2();

  for (const pointId of pointIds) {
    const point = state.c_pointsMap.get(pointId) as BezierPoint;
    centroid.add(point.to);
  }

  centroid.divideScalar(pointIds.length);
  return centroid;
}
