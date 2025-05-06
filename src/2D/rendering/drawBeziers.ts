import { BezierPoint, Geometry2D, State } from "../../types";
import { rad } from "../settings/interface";
import { getBuffer } from "./getBuffer";
import { geometryIsSelected } from "./utils/geometryIsSelected";
import { setDarkFill, setDarkLine, setDashedStroke, setNoFill } from "./utils/styleUtils";

export function drawBeziers(state:State) {
  const { canvas, context } = getBuffer('beziers');
  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  state.c_geometryMap.forEach((geometry: Geometry2D) => {
    if (geometry.type === 'bezier') {
      const pointIds = geometry.pointIds;
      context.beginPath();

      pointIds.forEach((pid:string, index:number) => {
        // Paths
        const point = state.c_pointsMap.get(pid) as BezierPoint;
        setDarkLine(context);
        if (index === 0) {
          context.moveTo(point.from.x, point.from.y);
        } else {
          const lastPoint = state.c_pointsMap.get(pointIds[index - 1]) as BezierPoint;
          context.bezierCurveTo(lastPoint.c1.x, lastPoint.c1.y, point.c2.x, point.c2.y, point.to.x, point.to.y);
        }
        context.stroke();

      });

      pointIds.forEach((pid:string, index:number) => {
        // Points and their handles
        const point = state.c_pointsMap.get(pid) as BezierPoint;

        // debug pixels
        setDarkFill(context);
        // context.fill();
        context.fillRect(point.to.x, point.to.y, 2, 2);
        context.fillRect(point.c1.x, point.c1.y, 2, 2);
        context.fillRect(point.c2.x, point.c2.y, 2, 2);

        context.beginPath();
        context.arc(point.to.x, point.to.y, rad * 1.25, 0, 2 * Math.PI);
        setDarkFill(context);
        context.fill();
        context.closePath();

        context.fillStyle = '#134ecc'
        context.beginPath();
        context.arc(point.c1.x, point.c1.y, rad, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        context.beginPath();
        context.arc(point.c2.x, point.c2.y, rad, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
        
        context.beginPath();
        context.moveTo(point.c1.x, point.c1.y);
        context.lineTo(point.c2.x, point.c2.y);
        context.moveTo(point.to.x, point.to.y);
        setDashedStroke(context);
        context.stroke();
        context.closePath();
        
      });

      if (geometryIsSelected(geometry.id)) {
        // Selected geometries, not yet in use 
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