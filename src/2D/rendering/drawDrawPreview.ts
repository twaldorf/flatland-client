import { Vector2 } from "three";
import { state } from "../../State";
import { cf_canvas_to_inch } from "../settings/factors";
import { rad } from "../settings/interface";
import { redrawCanvas } from "./canvas";
import { getBuffer } from "./getBuffer";
import { c_bgColor } from "../../UI/colors/colors";


export function drawDrawPreview(from: Vector2, to: Vector2, metric1?:string, metric2?:string): void {
  // Find the vertical and horizontal distances between the points
  const h = Math.max(Math.abs(from.y - to.y), 1);
  const w = Math.max(Math.abs(from.x - to.x), 1);

  // Bail if the cursor is within the point icon
  if (h * w < rad) {
    return;
  }

  const bundle = getBuffer('preview');

  const ctx = bundle.context;
  const canvas = bundle.canvas;

  // Prevent the canvas from getting smaller
  canvas.height = canvas.height > h ? canvas.height : h + 10;
  canvas.width = canvas.width > w ? canvas.width : w + 10;

  const originX = from.x > to.x ? to.x : from.x;
  const originY = from.y > to.y ? to.y : from.y;

  // Clear the canvas
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();

  // 2nd and 4th quadrants
  if ((from.x >= to.x && from.y >= to.y) || (from.x <= to.x && from.y <= to.y)) {
    // ctx.fillStyle = c_bgColor;
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
  } else {
    // 1st and 3rd quadrants
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
  }
  ctx.stroke();

  ctx.font = 'bold 22px sans-serif';
  if (!metric1 && !metric1) {
    ctx.fillText(`${Math.round(from.distanceTo(to)) / cf_canvas_to_inch / 2}in`, w / 2 - 5, h / 2 - 5);
  }
  if (metric1) {
    ctx.fillText(`${metric1}`, w / 2 - 5, h / 2 - 5); 
  }

  redrawCanvas();
  state.context.drawImage(canvas, originX, originY);
}
