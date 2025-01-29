import { pushCommand } from "../../Command";
import { localizePointerTo } from "../../pointer/LocalizePointerTo";
import { state } from "../../State";
import { PathToolCommand } from "../commands/PathToolCommand";
import { PathToolSelectCommand } from "../commands/PathToolSelectCommand";
import { PathTool } from "../tools/PathTool";
import { cLocalizePoint } from "./cLocalizePoint";

// export const cOnMouseDown = (event:MouseEvent):void => {
//   state.pointer = cLocalizePoint(event.clientX, event.clientY);
//   state.pointerDown = true;

//   switch (state.tool.name) {
//     case "path":
//       const pathTool = state.tool as PathTool;
//       const closePointIndex = pathTool.checkPointOverlap(state.pointer);

//       if (typeof closePointIndex == 'number' && closePointIndex >= 0) {
//         state.c_move_from = state.pointer.clone();
//         // state.cMovingPoint = true;
//         state.cSelecting = true;
//         state.pendingSelection = new PathToolSelectCommand(closePointIndex);
//       } else {
//         state.cSelecting = false;
//         pushCommand(new PathToolCommand(pathTool, state.pointer));
//       }
//     }
// }