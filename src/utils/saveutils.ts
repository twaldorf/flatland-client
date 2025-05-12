import { Vector2 } from "three";
import { BezierPoint, Geometry2D, Point } from "../types";

export const flattenBezierPoint = (bp:BezierPoint):number[] => {
  return [ bp.to.x, bp.to.y, bp.from.x, bp.from.y, bp.c1.x, bp.c1.y, bp.c2.x, bp.c2.y ];
}

export const restoreBezierPoint = (arr:number[]):BezierPoint => {
  const point = {
    to: new Vector2(arr[0], arr[1]),
    from: new Vector2(arr[2], arr[3]),
    c1: new Vector2(arr[4], arr[5]),
    c2: new Vector2(arr[6], arr[7])
  }
  return point;
}

export const flattenPointsMap = (pm:Map<string, Point>) => {
  return Array.from(pm.entries()).map(([ id, point ]) => {
    return [ id, flattenBezierPoint(point as BezierPoint) ];
  });
}

export const restorePointsMap = ( flat: Array<[string, number[]]>): Map<string, BezierPoint> => {
  return new Map(flat.map(([id, arr]) => [id, restoreBezierPoint(arr)]));
};

export const flattenGeometryMap = (gm: Map<string, Geometry2D>): Array<[string, { type: string; pointIds: string[] }]> =>
  Array.from(gm.entries()).map(([id, geom]) => [
    id,
    {
      type:     geom.type,
      pointIds: geom.pointIds,
    },
  ]);

export const restoreGeometryMap = (arr:Array<[string, { type: string; pointIds: string[] }]>):Map<string, Geometry2D> => {
  const map = new Map();
  arr.forEach(([id, { type, pointIds }]) => {
    map.set(id, { id, type, pointIds });
  })
  return map;
}

