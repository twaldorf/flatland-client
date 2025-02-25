import { point } from "./canvas";



export function drawArrayOfPointIndices(points: number[], context: OffscreenCanvasRenderingContext2D|CanvasRenderingContext2D): void {
  const _ = context;
  if (points.length > 0) {
    _.beginPath();
    _.strokeStyle = 'black';
    const firstPoint = point(points[0]);
    _.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < points.length; ++i) {
      _.lineTo(point(points[i]).x, point(points[i]).y);
      _.moveTo(point(points[i]).x, point(points[i]).y);
    }
  }
  _.stroke();
}
