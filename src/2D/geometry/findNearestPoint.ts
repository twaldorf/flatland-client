import { Vector2 } from "three";
import { selectionRadius } from "../settings/interface";

export function findNearestPoint(pos: Vector2, points: Vector2[]): number | null {
  let closestIndex:number | null = null;
  let closestDist = Infinity;

  points.forEach((point, index) => {
    const dist = point.distanceTo(pos);
    if (dist < selectionRadius && dist < closestDist) {
      closestIndex = index;
      closestDist = dist;
    }
  });

  return closestIndex;
}
