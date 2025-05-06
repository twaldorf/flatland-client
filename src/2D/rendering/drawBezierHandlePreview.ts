import { Vector2 } from "three";
import { getBuffer } from "./getBuffer";
import { rad, selectionRadius } from "../settings/interface";
import { state } from "../../State";
import { setDashedStroke, setLightLine } from "./utils/styleUtils";

export function drawBezierHandlePreview(
  c1:Vector2, 
  anchor: Vector2, 
  lastPoint?: Vector2, 
  lastC1?:Vector2
) {

  // shorthand
  const drawDotAt = (x:number, y:number, radius:number = rad) => { 
    context.beginPath();
    context.arc(x, y, radius / 2, 0, 2 * Math.PI, false);
    context.closePath();
   }

  const { context, canvas } = getBuffer('bezier preview');
  canvas.height = state.canvas.height;
  canvas.width = state.canvas.width;
  
  setLightLine(context);
  drawDotAt(c1.x, c1.y);

  setDashedStroke(context);
  context.beginPath();
  context.moveTo(c1.x, c1.y);
  context.lineTo(anchor.x, anchor.y);
  context.stroke();

  const c2 = c1.clone().rotateAround(anchor, Math.PI);
  drawDotAt(c2.x, c2.y);
  setDashedStroke(context);
  context.moveTo(c2.x, c2.y);
  context.lineTo(anchor.x, anchor.y);

  if (lastPoint && lastC1) {
    context.moveTo(lastPoint.x, lastPoint.y);
    context.bezierCurveTo(lastC1.x, lastC1.y, c2.x, c2.y, anchor.x, anchor.y);
  }
  context.stroke();
  context.closePath();

  context.beginPath();
  setLightLine(context);
  // drawDotAt(anchor.x, anchor.y, rad * 1.5);
  context.fill();

  state.context.drawImage(canvas, 0, 0);
}