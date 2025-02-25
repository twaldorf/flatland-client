import { point } from "./canvas";

export function drawPolygonFromPointIndices(points: number[], context: OffscreenCanvasRenderingContext2D) {
  const _ = context;
  if (points.length > 0) {
    _.beginPath();
    _.fillStyle = '#B9C4EC';
    _.strokeStyle = 'black';

    const firstPoint = point(points[0]);
    _.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < points.length; ++i) {
      const p = point(points[i]);
      _.lineTo(p.x, p.y);
    }

    _.lineTo(firstPoint.x, firstPoint.y);
    _.fill();
    _.stroke();
  }
}

export function drawPolygonFromOffsetPointIndices(points: number[], xoffset:number, yoffset:number, context: OffscreenCanvasRenderingContext2D|CanvasRenderingContext2D) {
  const _ = context;
  if (points.length > 0) {
    _.beginPath();
    _.fillStyle = '#B9C4EC';
    _.strokeStyle = 'black';

    const firstPoint = point(points[0]);
    _.moveTo(firstPoint.x + xoffset, firstPoint.y + yoffset);

    for (let i = 1; i < points.length; ++i) {
      const p = point(points[i]);
      _.lineTo(p.x + xoffset, p.y + yoffset);
    }

    _.lineTo(firstPoint.x + xoffset, firstPoint.y + yoffset);
    _.fill();
    _.stroke();
  }
}