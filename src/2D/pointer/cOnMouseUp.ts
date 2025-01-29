import { pushCommand } from "../../Command";
import { state } from "../../State";
import { PathToolMovePointCommand } from "../commands/PathToolMovePointCommand";
import { cLocalizePoint } from "./cLocalizePoint";

// export const cOnMouseUp = (e:MouseEvent) => {
//   if (state.cMovingPoint) {
//     pushCommand( new PathToolMovePointCommand( state.c_selected, state.c_move_from, cLocalizePoint( e.clientX, e.clientY ) ) );
//     state.cSelecting = false;
//   }
//   if (state.cSelecting) {
//     pushCommand( state.pendingSelection );
//   }
//   state.pointerDown = false;
//   state.cSelecting = false;
//   state.cMovingPoint = false;
//   // There should be a function for doing all these no-op ops–ending selection, ending drag, hints, etc
// }