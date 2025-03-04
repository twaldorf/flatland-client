import { Vector2 } from "three";
import { state } from "../../State";
import { cf_canvas_to_inch } from "../settings/factors";

export const cLocalizePoint = (sx:number, sy:number):Vector2 => {
  const rect = state.canvas.getBoundingClientRect();
  const yoffset = rect.top + window.scrollY;
  const xoffset = rect.left;
  sy -= yoffset;
  sx -= xoffset;
  if (state.shiftDown) {
    console.log(sx, sy)
    const param = cf_canvas_to_inch / 2;
    sx = Math.round(sx / param) * param;
    sy = Math.round(sy / param) * param;
    console.log(sx, sy)
  }
  // sx, sy in [-1, 1];
  // x, y in [0, width, height resp.];
  // const x = ( sx - state.canvas.getBoundingClientRect().x ) ;
  // const y = ( sy - state.canvas.getBoundingClientRect().y ) ;
  return new Vector2(sx * 2, sy * 2);
}