import { Vector2 } from "three";
import { getBuffer } from "./getBuffer";
import { selectionRadius } from "../settings/interface";
import { state } from "../../State";
import { setLightLine } from "./utils/styleUtils";

export function drawNewPointPreview(pos:Vector2) {
  const { context, canvas } = getBuffer('new point preview', pos.clone().addScalar(-selectionRadius));
  canvas.height = selectionRadius * 2 + 2;
  canvas.width = selectionRadius * 2 + 2;
  setLightLine(context);
  // context.fillRect(0, 0, selectionRadius, selectionRadius);
  // context.beginPath();
  context.arc(selectionRadius, selectionRadius, selectionRadius / 2, 0, 2 * Math.PI, false);
  // context.fill();
  context.stroke();
  state.context.drawImage(canvas, pos.x - selectionRadius, pos.y - selectionRadius);
}

export function applyDrawPreviews() {
  const obj = state.c_buffers.get('new point preview');
  if (obj) state.context.drawImage(obj.canvas, obj.pos.x, obj.pos.y);

  const beziers = state.c_buffers.get('bezier preview');
  if (beziers) state.context.drawImage(beziers.canvas, beziers.pos.x, beziers.pos.y);
}
