import { Vector2 } from "three";

/**
 * Checks if a point is inside a polygon using the ray-casting algorithm.
 * @param point The point to check.
 * @param polygon An array of Vector2 points defining the closed shape.
 * @returns `true` if the point is inside the polygon, `false` otherwise.
 */
export function isPointInPolygon(point: Vector2, polygon: Vector2[]): boolean {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;

    // Check if point is between polygon edges
    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}
