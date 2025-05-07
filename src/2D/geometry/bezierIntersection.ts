import { Vector2 } from "three";
import { state } from "../../State";
import { BezierPoint, Geometry2D } from "../../types";

/** Evaluate the cubic Bézier at parameter t ∈ [0,1]. */
function evalCubic(
  P0: Vector2, P1: Vector2, P2: Vector2, P3: Vector2,
  t: number
): Vector2 {
  const u = 1 - t;
  return new Vector2(
    u*u*u * P0.x + 3*u*u*t * P1.x + 3*u*t*t * P2.x + t*t*t * P3.x,
    u*u*u * P0.y + 3*u*u*t * P1.y + 3*u*t*t * P2.y + t*t*t * P3.y
  );
}

/** Squared distance from point P to the line segment VW. */
function pointToSegmentDistanceSq(
  P: Vector2,
  V: Vector2,
  W: Vector2
): number {
  const l2 = V.distanceToSquared(W);
  if (l2 === 0) return P.distanceToSquared(V);
  let t = ((P.x - V.x)*(W.x - V.x) + (P.y - V.y)*(W.y - V.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const proj = new Vector2(
    V.x + t*(W.x - V.x),
    V.y + t*(W.y - V.y)
  );
  return P.distanceToSquared(proj);
}

/**
 * Approximate the minimum squared distance from P to the cubic Bézier defined by `bp`.
 * We sample `steps` segments between t=0 and t=1.
 */
function bezierDistanceSq(bp: BezierPoint, P: Vector2, steps = 20): number {
  let minSq = Infinity;
  let prev = bp.from;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const curr = evalCubic(bp.from, bp.c1, bp.c2, bp.to, t);
    const dsq = pointToSegmentDistanceSq(P, prev, curr);
    if (dsq < minSq) minSq = dsq;
    prev = curr;
  }
  return minSq;
}

/**
 * Returns true if `point` is within `radius` of any Bézier segment
 * in the given Geometry2D (i.e. when `geom.type === 'bezier'`).
 */
export function isPointNearBezierGeometry(
  point: Vector2,
  geom: Geometry2D,
  radius: number,
  steps = 20
): boolean {
  if (geom.type !== "bezier") return false;
  const r2 = radius * radius;

  for (const pid of geom.pointIds) {
    const bp = state.c_pointsMap.get(pid);
    if (!bp) continue;
    // if this point isn’t actually a BezierPoint, skip
    if ((bp as BezierPoint).to === undefined) continue;

    const distSq = bezierDistanceSq(bp as BezierPoint, point, steps);
    if (distSq <= r2) return true;
  }

  return false;
}
