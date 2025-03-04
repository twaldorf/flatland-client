import { Vector2 } from "three";
import { state } from "../../State";

export const cLocalizePoint = (sx:number, sy:number):Vector2 => {
  if (state.shiftDown) {
    sx = Math.round(sx / 10) * 10;
    sy = Math.round(sy / 10) * 10;
  }
  // sx, sy in [-1, 1];
  // x, y in [0, width, height resp.];
  const x = ( sx - state.canvas.getBoundingClientRect().x ) ;
  const y = ( sy - state.canvas.getBoundingClientRect().y ) ;
  return new Vector2(x * 2, y * 2);
}