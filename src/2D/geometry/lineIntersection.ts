import { Vector2 } from "three";
import { rad } from "../settings/interface";
import { state } from "../../State";

export function pointLineIntersection(point: Vector2, v0: Vector2, v1: Vector2) {

  // Ensure v0 is always the leftmost point
  let p0 = v0.x > v1.x ? v1.clone() : v0.clone();
  let p1 = v0.x > v1.x ? v0.clone() : v1.clone();

  // Bounding box check
  const minX = Math.min(p0.x, p1.x) - rad * 2;
  const maxX = Math.max(p0.x, p1.x) + rad * 2;
  const minY = Math.min(p0.y, p1.y) - rad * 2;
  const maxY = Math.max(p0.y, p1.y) + rad * 2;

  if (!(point.x >= minX && point.x <= maxX && point.y >= minY && point.y <= maxY)) {
    return false;
  }

  // Compute line equation: y = mx + b
  const dx = p1.x - p0.x;
  if (dx === 0) {
    // Vertical line case
    return Math.abs(point.x - p0.x) < rad * 2;
  }

  const m = (p1.y - p0.y) / dx;
  const b = p0.y - m * p0.x;

  // Check if the point lies close to the line within a tolerance
  const epsilon = rad * 2;
  return Math.abs(point.y - (m * point.x + b)) < epsilon;
}

// export function pointLineIntersection(point:Vector2, v0:Vector2, v1:Vector2, dummy:Vector2) {
//   // const box = getRectFromTwoPoints(lineStart, lineEnd);
//   // start and end are generic, i.e., the points could be in any orientation
//   // sort points
//   if (v0.x > v1.x) {
//     dummy.copy(v1);
//     v1.copy(v0);
//     v0.copy(dummy);
//   }

//   // v0 is leftmost, v1 is rightmost
//   var rectCheck;
//   if (v0.y < v1.y) {
//     rectCheck = point.x >= v0.x - rad &&
//                 point.y >= v0.y - rad &&
//                 point.x <= v1.x + rad &&
//                 point.y <= v1.y - rad;
//   } else {
//     rectCheck = point.x >= v0.x - rad && 
//                 point.y <= v0.y + rad && 
//                 point.x <= v1.x + rad && 
//                 point.y >= v1.y - rad;
//   }

//   if (rectCheck) {
//       const y = point.y;
//       const m = (v1.y - v0.y) / 
//                 ( v1.x - v0.x );
//       const x = point.x;
//       const b = v0.y;
//       console.log(Math.round(y / rad), Math.round((m*x + b) / rad));
//       if ( y == m*x + b ) {
//         return true;
//       } else {
//         return false;
//       }
//     }
// }

export interface LineHit {
  shapeIndex: number;
  lineStartIndex: number;
}

export function checkLineIntersection(pos:Vector2):LineHit | null {
  var result = null;
  state.c_shapes.forEach((shapeArr:number[], index) => {
    console.log(shapeArr)
    for (let i = 0; i < shapeArr.length - 1; ++i) {
      const p0 = state.c_points[shapeArr[i]];
      const p1 = state.c_points[shapeArr[(i + 1) % (shapeArr.length - 1)]];
      if (pointLineIntersection(pos, p0, p1)) {
        result = { shapeIndex: index, lineStartIndex: i };
      }
    }
  })
  return result;
}
