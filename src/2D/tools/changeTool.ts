import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { useAppState } from "../../UI/AppState";
import { drawCanvasFromState, redrawCanvas } from "../rendering/canvas";
import { BezierPointEditorTool } from "./BezierPointEditorTool";
import { GrainlineTool } from "./GrainlineTool";
import { MeasureTool } from "./MeasureTool";
import { PathTool } from "./PathTool";
import { SelectTool } from "./SelectTool";

export function changeTool(toolState: { name: string } & Partial<Omit<ToolBase, 'name'>>) {
  // name is required, all other properties optional

  // Context: this needs to be the tool name but it should also accept entire tool state wholesale for the purposes of undo
  const newToolName = toolState.name;
  const importedState = toolState.state;

  console.log(toolState.name)
  
  state.tool.dismountEvents();
  useAppState.getState().resetUI();

  switch (newToolName) {
    case "path":
        state.tool = new PathTool();
        useAppState.getState().setSelectedTool("path");
        if (importedState) {
          state.tool.applyState(importedState);
        }
        redrawCanvas();
        break;
        
    case "select":
      state.tool = new SelectTool();
      useAppState.getState().setSelectedTool("select");
      redrawCanvas();
      break;

    case "measure":
      state.tool = new MeasureTool();
      useAppState.getState().setSelectedTool("measure");
      redrawCanvas();
      break;

    case "grainline":
      state.tool = new GrainlineTool();
      useAppState.getState().setSelectedTool("grainline");
      redrawCanvas();
      break;

    case "bezier point editor":
      state.tool = new BezierPointEditorTool(state.c_selectedPoints[0]); // A bit brittle, this corresponds to the selection made by the select tool
      useAppState.getState().setSelectedTool("bezier point editor");
      drawCanvasFromState(state);
      break;
          
    default:
      state.tool = new SelectTool();
      useAppState.getState().setSelectedTool("select");
      redrawCanvas();
      break;
  }
  state.tool.initializeEvents();
}