import { Vector2 } from "three";
import { selectionRadius } from "../settings/interface";
import { Geometry2D } from "../../types";
import { state } from "../../State";

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

export function findNearestGeometryPoint( pos: Vector2, geometries: Geometry2D[] ): string | null {
  if (!geometries?.at(0)) {
    return null;
  }
  let nearestId: string | null = null;
  let minDistSq = Infinity;

  for (const geom of geometries) {
    for (const pointId of geom.pointIds) {
      const pt = state.c_pointsMap.get(pointId);
      if (!pt) continue;

      const dx = pt.to.x - pos.x;
      const dy = pt.to.y - pos.y;
      const distSq = dx*dx + dy*dy;

      // ! Note: sqrt is very expensive
      if ( Math.sqrt(distSq) < selectionRadius && distSq < minDistSq ) {
        minDistSq = distSq;
        nearestId = pointId;
      }
    }
  }

  return nearestId;
}