import { state } from "../../../State";
import { Geometry2D } from "../../../types";

export function geometryIsSelected(gId:string) {
  return state.c_selected_geometries.some((selected:Geometry2D) => {
    if (gId === selected.id) {
      return true;
    }
  });
}