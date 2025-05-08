import { Vector2 } from "three";
import { selectionRadius } from "../settings/interface";
import { BezierPoint, Geometry2D } from "../../types";
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

      if ( Math.sqrt(distSq) < selectionRadius && distSq < minDistSq ) {
        minDistSq = distSq;
        nearestId = pointId;
      }
    }
  }

  return nearestId;
}

export function findNearestAnyPoint( pos: Vector2 ): string | undefined {

  let nearestId: string | undefined = undefined;
  let minDistSq = Infinity;

  for (const pid of state.c_pointsMap.keys()) {
    const point = state.c_pointsMap.get(pid) as BezierPoint;
    if (!point) {
      return undefined;
    }

    for (const subpoint of Object.values(point)) {

      const dx = subpoint.x - pos.x;
      const dy = subpoint.y - pos.y;
      const distSq = dx*dx + dy*dy;

      if ( Math.sqrt(distSq) < selectionRadius && distSq < minDistSq ) {
        minDistSq = distSq;
        nearestId = pid;
      }
    }
  }

  console.log(nearestId)
  return nearestId;
}