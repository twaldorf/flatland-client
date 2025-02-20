import { state } from "../../State";
import { cf_canvas_to_inch } from "../settings/factors";
import { getBuffer } from "./getBuffer";


export function drawYRuler() {
  const bundle = getBuffer('grid');

  const ctx = bundle.context;
  const bufferCanvas = bundle.canvas;

  // Buffer
  bufferCanvas.width = 10;
  bufferCanvas.height = state.canvas.height;

  ctx.lineWidth = 1;

  // Draw inches
  for (let i = 1; i < bufferCanvas.height; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.lineTo(10, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.stroke();
  }

  // Draw inches
  for (let i = 1; i < bufferCanvas.height; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * .25 * state.c_zoomfactor);
    ctx.lineTo(2.5, i * cf_canvas_to_inch * .25 * state.c_zoomfactor);
    ctx.stroke();
  }

  state.context.drawImage(bufferCanvas, 0, 0);
}

export function drawGridRuler() {
  const bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = state.canvas.width;
  bufferCanvas.height = state.canvas.height;
  const ctx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';

  // Draw inches
  for (let i = 25; i < bufferCanvas.height - 25; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.lineTo(10, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.stroke();
  }

  // Draw inches
  for (let i = 25; i < bufferCanvas.height - 25; ++i) {
    ctx.moveTo(i * cf_canvas_to_inch * .25 * state.c_zoomfactor, 0);
    ctx.lineTo(i * cf_canvas_to_inch * .25 * state.c_zoomfactor, 25);
    ctx.stroke();
  }

  state.context.drawImage(bufferCanvas, 0, 0);
}
