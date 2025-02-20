import { Vector2 } from "three";
import { state } from "../../State";
import { drawCanvasFromState } from "./canvas";


export function drawSelectionMovePreview(pos: Vector2): void {
  drawCanvasFromState(state);
  state.context.fillStyle = 'pink';
  state.context.fillRect(pos.x - 5, pos.y - 5, 10, 10);
}
