import { Vector2 } from "three";
import { BezierPoint, Geometry2D, Point } from "../../types";
import { state } from "../../State";
import { point } from "../rendering/canvas";

export function getPointArray(geomId: string):Array<Vector2> | undefined {
  const points = state.c_geometryMap.get(geomId)?.pointIds;

  if (!points) {
    return undefined;
  }

  if (points[0] === points[points.length - 1]) {
    points.pop();
  }
  
  return points.map((pointId:string) => {
    const point:Point = state.c_pointsMap.get(pointId) as Point;
    // This should be replaced by a typeguard or some kind of switch on a metadata type property
    if (point.to) {
      return point.to;
    } else {
      return point;
    }
  })
}

export function getPointArrayFromIds(pointIds:string[]):Vector2[] {
  pointIds.pop();
  const vectors = pointIds.reduce( ( prev:any, id:string ):any => {
    const point = state.c_pointsMap.get(id) as BezierPoint;
    return [...prev, 
      point.to, point.from, point.c1, point.c2
    ];
  }, []);

  return vectors;

}