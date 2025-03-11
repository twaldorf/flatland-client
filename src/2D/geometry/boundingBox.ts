import { Vector2 } from "three";
import { state } from "../../State";

// Given an array of point indices which make up a shape,
// Return a bounding rect within the coordinate space (i.e. not normalized)
// In the form of x0, y0: upper left and x1, y1: bottom right
export function getShapeBoundingRect(shapeArr: number[]): { x0: number, y0: number, x1: number, y1: number } {
  if (shapeArr.length === 0) {
    throw new Error("Shape array is empty.");
  }

  const points = shapeArr.map((index) => state.c_points[index]);

  if (points.some((p) => !p)) {
    throw new Error("Invalid point index in shape.");
  }

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;

  for (const point of points) {
    if (point) {
      x0 = Math.min(x0, point.x);
      y0 = Math.min(y0, point.y);
      x1 = Math.max(x1, point.x);
      y1 = Math.max(y1, point.y);
    }
  }

  return { x0, y0, x1, y1 };
}

// Overload stand-in for Map of points, not necessarily closed shapes
export function getMapShapeBoundingRect(shapeMap: Map<string, Vector2>) {
  const points = shapeMap.values().toArray();

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;

  for (const point of points) {
    if (point) {
      x0 = Math.min(x0, point.x);
      y0 = Math.min(y0, point.y);
      x1 = Math.max(x1, point.x);
      y1 = Math.max(y1, point.y);
    }
  }

  return { x0, y0, x1, y1 };
}


// Given an array of point indices making up a shape (where the points are in state.c_points:number[]),
// return an object containing the width and height of the shape
export function getShapeDimensions(shapeArr: number[]): { width: number, height: number } {
  const { x0, y0, x1, y1 } = getShapeBoundingRect(shapeArr);
  return { width: x1 - x0, height: y1 - y0 };
}

// Overload stand-ion for map for points, not necessarily closed shapes
export function getMapShapeDimensions(shapeMap: Map<string, Vector2>): { width: number, height: number } {
  const { x0, y0, x1, y1 } = getMapShapeBoundingRect(shapeMap);
  return { width: x1 - x0, height: y1 - y0 };
}
