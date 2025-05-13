import { state } from "../../../State";
import { Geometry2D } from "../../../types";

export function geometryIsSelected(gId:string) {
  return state.c_selectedGeometries.some((selected:string) => {
    if (gId === selected) {
      return true;
    }
  });
}