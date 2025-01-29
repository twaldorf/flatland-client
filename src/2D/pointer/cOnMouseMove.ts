import { pushCommand } from "../../Command";
import { state } from "../../State";
import { cLocalizePoint } from "./cLocalizePoint"

// export const cOnMouseMove = (e:MouseEvent) => {
//   if (state.cActive && state.pointerDown) {
//     if (state.cSelecting) {
//       if (state.cMovingPoint) {
//         state.context.fillStyle = 'gray'
//         const pos = cLocalizePoint(e.clientX, e.clientY);
//         state.context.moveTo(pos.x, pos.y);
//         state.context.lineTo(state.c_move_from.x, state.c_move_from.y);
//         state.context.stroke();
//       }
//       state.cMovingPoint = true;
//       // state.c_move = cLocalizePoint(e.clientX, e.clientY);
//       // console.log(state.c_move_from);
//     }
//   }
// }