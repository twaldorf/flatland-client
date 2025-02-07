import { state } from "../../State";
import { ToolName } from "../../types";
import { useAppState } from "../../UI/store";
import { PathTool } from "./PathTool";
import { SelectTool } from "./SelectTool";

export type ToolState = {
  type: ToolName;
}

export function changeTool(newState:ToolState) {
  state.tool.dismountEvents();
  switch (newState.type) {
    case "path":
        state.tool = new PathTool();
        useAppState.getState().setSelectedTool("path");
        break;
        
    case "select":
      state.tool = new SelectTool();
      useAppState.getState().setSelectedTool("select");
      break
          
    default:
      state.tool = new SelectTool();
      useAppState.getState().setSelectedTool("select");
      break;
  }
  state.tool.initializeEvents();
}