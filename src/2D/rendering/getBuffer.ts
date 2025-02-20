import { state } from "../../State";
import { BufferType, BufferBundle } from "../../types";

// Get or create and return a buffer bundle
// A created buffer bundle has a 0 area canvas
export function getBuffer(buffer: BufferType): BufferBundle {
  // Get or create the canvas and context for the preview buffer
  let bundle = state.c_buffers.get(buffer);
  if (!bundle || !bundle.context || !bundle.canvas) {
    const canvas = new OffscreenCanvas(0, 0);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    bundle = { canvas, context: ctx };
    state.c_buffers.set(buffer, bundle);
  }

  return bundle;
}
