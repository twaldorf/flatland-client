import { state } from "../../State";
import { ToolName } from "../../types";
import { PathTool } from "./PathTool";
import { SelectTool } from "./SelectTool";

export type ToolState {
  type: ToolName;
}

export function changeTool(newState:ToolState) {
  console.log('Change Tool');
  switch (newState.type) {
    case "path":
        state.tool = new PathTool();
        break;
        
    case "select":
      state.tool = new SelectTool();
      break
          
    default:
      state.tool = new SelectTool();
      break;
  }
  state.tool.initializeEvents();
}