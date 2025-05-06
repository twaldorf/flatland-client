import { Vector2 } from "three";
import { BezierPoint } from "../../types";

/**
 * Evaluate the cubic Bézier at parameter t ∈ [0,1].
 */
function evalCubic(
  from: Vector2,
  c1: Vector2,
  c2: Vector2,
  to: Vector2,
  t: number
): Vector2 {
  const u = 1 - t;
  // Bernstein basis:
  // B(t) = u³·P0 + 3u²t·P1 + 3u·t²·P2 + t³·P3
  const p = new Vector2();
  p.addScaledVector(from,    u*u*u);
  p.addScaledVector(c1, 3 * u*u * t);
  p.addScaledVector(c2, 3 * u * t*t);
  p.addScaledVector(to,       t*t*t);
  return p;
}

/**
 * Approximate the length of one BézierPoint segment by sampling `steps` points.
 * Increasing `steps` improves accuracy at the cost of more math.
 */
export function estimateBezierLength(
  bp: BezierPoint,
  steps = 20
): number {
  let length = 0;
  let prev = bp.from;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const pt = evalCubic(bp.from, bp.c1, bp.c2, bp.to, t);
    length += pt.distanceTo(prev);
    prev = pt;
  }
  return length;
}