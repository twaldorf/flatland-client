import { pushCommand } from "../../Command";
import { state } from "../../State";
import { cLocalizePoint } from "./cLocalizePoint"

export const cOnMouseMove = (e:MouseEvent) => {
  if (state.cActive && state.pointerDown) {
    if (state.cSelecting) {
      // state.cMovingPoint = true;
      // state.c_move = cLocalizePoint(e.clientX, e.clientY);
      // console.log(state.c_move_from);
    }
  }
  
}