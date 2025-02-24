import { state } from "../../State";
import { State } from "../../types";
import { getShapeBoundingRect } from "../geometry/boundingBox";
import { drawArrayOfPointIndices } from "./drawArrayOfPointIndices";
import { drawPolygonFromOffsetPointIndices, drawPolygonFromPointIndices } from "./drawPolygonFromPointIndices";
import { getBuffer } from "./getBuffer";

// Draw paths AND shapes
export const drawPaths = (state: State) => {
  const { canvas, context } = getBuffer('paths');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  const _ = context;

  // Make sure this is not a copy op
  const paths = state.c_paths;

  paths.forEach((points, i) => {
    // points is the array of point indices within state.c_points, i is the path index, not important
    drawArrayOfPointIndices(points, context);
  });

  if (state.c_shapes.length > 0) {
    // draw shapes
    state.c_shapes.forEach((shapeArr) => {
      drawShape(shapeArr,context) 
    });
  }

  state.context.drawImage(canvas, 0, 0);
};

export function drawShape(shapeArr:number[], context:OffscreenCanvasRenderingContext2D) {
  drawArrayOfPointIndices(shapeArr, context);
  drawPolygonFromPointIndices(shapeArr, context);
}
export function drawShapeNormalized(shapeArr:number[], context:OffscreenCanvasRenderingContext2D) {
  const box = getShapeBoundingRect(shapeArr);
  drawPolygonFromOffsetPointIndices(shapeArr, -box.x0, -box.y0, context);
}

export function applyPaths() {
  const obj = state.c_buffers.get('paths');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}
