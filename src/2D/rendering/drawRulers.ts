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
  const bundle = getBuffer('grid');

  const ctx = bundle.context;
  const bufferCanvas = bundle.canvas;

  bufferCanvas.width = state.canvas.width;
  bufferCanvas.height = state.canvas.height;

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'white';

  // TODO: Center the start of the grid with an offset
  const verticalGridHeight = cf_canvas_to_inch * 2;
  const xMargin = verticalGridHeight;

  const toX = Math.floor(bufferCanvas.width / verticalGridHeight) * verticalGridHeight;
  const toY = Math.floor(bufferCanvas.height / verticalGridHeight) * verticalGridHeight - verticalGridHeight; 

  for (let i = 1; i < Math.floor(bufferCanvas.height / verticalGridHeight); ++i) {
    // Draw horizontal lines from top to bottom
    ctx.moveTo(verticalGridHeight, i * verticalGridHeight);
    ctx.lineTo(toX, i * verticalGridHeight);
    ctx.stroke();
  }

  for (let i = 1; i <= Math.floor(bufferCanvas.width / verticalGridHeight); ++i) {
    ctx.moveTo(i * verticalGridHeight, xMargin);
    ctx.lineTo(i * verticalGridHeight, toY);
    ctx.stroke();
  }

  state.context.drawImage(bufferCanvas, 0, 0);
}
