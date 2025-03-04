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
    const param = cf_canvas_to_inch / 2;
    sx = Math.round(sx / param) * param;
    sy = Math.round(sy / param) * param;
  }
  return new Vector2(sx * 2, sy * 2);
}