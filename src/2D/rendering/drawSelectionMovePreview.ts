import { Vector2 } from "three";
import { state } from "../../State";
import { drawCanvasFromState, redrawCanvas } from "./canvas";
import { getBuffer } from "./getBuffer";
import { drawShape, drawShapeNormalized } from "./drawPaths";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";


export function drawSelectionMovePreview(pos: Vector2): void {
  redrawCanvas();
  state.context.fillStyle = 'pink';
  state.context.fillRect(pos.x - 5, pos.y - 5, 10, 10);
}

export function drawShapeSelectionMovePreview(pos: Vector2):void {
  const { canvas, context } = getBuffer('shape_preview');

  const dif = state.c_move_from.clone().sub(pos);

  const shapesArr = state.c_selected_shapes.map(i => state.c_shapes[i]).flat(2);

  const dim = getShapeDimensions(shapesArr);

  const box = getShapeBoundingRect(shapesArr);

  canvas.width = dim.width;
  canvas.height = dim.height;

  state.c_selected_shapes.forEach((shapeIndex:number) => {
    drawShapeNormalized(state.c_shapes[shapeIndex], context);
  })

  state.context.drawImage(canvas, pos.x - (pos.x - box.x0) - dif.x, pos.y - (pos.y - box.y0) - dif.y);
}

export function applyShapeSelectionMovePreview(pos:Vector2):void {
  const { canvas, context } = getBuffer('shape_preview');
  const shapesArr = state.c_selected_shapes.map(i => state.c_shapes[i]).flat(2);
  const box = getShapeBoundingRect(shapesArr);
  if (canvas) {
    state.context.drawImage(canvas, pos.x - (pos.x - box.x0), pos.y - (pos.y - box.y0));
  } 
}