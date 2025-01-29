import { Vector2 } from "three";
import { state } from "../../State";

export const cLocalizePoint = (sx:number, sy:number):Vector2 => {
  // sx, sy in [-1, 1];
  // x, y in [0, width, height resp.];
  const x = ( sx - state.canvas.getBoundingClientRect().x ) ;
  const y = ( sy - state.canvas.getBoundingClientRect().y ) ;
  return new Vector2(x, y);
}