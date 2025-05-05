import { BezierPoint, Geometry2D, State } from "../../types";
import { rad } from "../settings/interface";
import { BezierTool } from "../tools/BezierTool";
import { getBuffer } from "./getBuffer";
import { geometryIsSelected } from "./utils/geometryIsSelected";

export function drawBeziers(state:State) {
  const { canvas, context } = getBuffer('beziers');
  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  state.c_geometryMap.forEach((geometry: Geometry2D) => {
    if (geometry.type === 'bezier') {
      const pointIds = geometry.pointIds;
      context.beginPath();

      pointIds.forEach((pid:string, index:number) => {
        const point = state.c_pointsMap.get(pid) as BezierPoint;
        if (index === 0) {
          context.moveTo(point.from.x, point.from.y);
        } else {
          const lastPoint = state.c_pointsMap.get(pointIds[index - 1]) as BezierPoint;
          context.bezierCurveTo(lastPoint.c1.x, lastPoint.c1.y, point.c2.x, point.c2.y, point.to.x, point.to.y);
        }
        context.stroke();
        context.fillRect(point.from.x, point.from.y, 5, 5);
        context.fillRect(point.to.x, point.to.y, 5, 5);
        context.fillStyle = 'red';
        context.fillRect(point.c1.x, point.c1.y, rad, rad);
        context.fillStyle = 'blue';
        context.fillRect(point.c2.x, point.c2.y, rad, rad);
      });
      
      if (geometryIsSelected(geometry.id)) {
        pointIds.forEach((pid:string) => {
          const point = state.c_pointsMap.get(pid) as BezierPoint;
          context.setLineDash([5, 5]);
          context.stroke();
          context.moveTo(point.to.x, point.to.y);
          context.lineTo(point.c2.x, point.c2.y);
          context.moveTo(point.to.x, point.to.y);
          context.lineTo(point.c1.x, point.c1.y);
          context.setLineDash([]);
        })
      }
    }
  })

  state.context.drawImage(canvas, 0, 0);
}

export function applyBeziers(ctx:CanvasRenderingContext2D) {
  const { context, canvas } = getBuffer('beziers');
  if (context && canvas && canvas.width > 0 && canvas.height > 0) {
    ctx.drawImage(canvas, 0, 0);
  }
}