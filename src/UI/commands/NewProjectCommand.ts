import { drawCanvasFromState } from "../../2D/rendering/canvas";
import { Command } from "../../Command"
import { state } from "../../State"
import { ProjectInfo } from "../../types";
import { useAppState } from "../AppState";

export class NewProjectCommand implements Command {
  private previousState: string;
  private projectInfo: ProjectInfo;

  constructor(projectInfo:ProjectInfo) {
    this.previousState = state.serialize();
    this.projectInfo = projectInfo;
  }

  do() {
    state.clear() 
    useAppState.getState().setActiveProjectTitle(this.projectInfo.title);
    state.projectInfo = this.projectInfo;
    drawCanvasFromState(state);
  }

  undo() {
    state.deserialize(this.previousState)
  }
}

export class DownloadProjectCommand implements Command {
  do() {
    const json = state.serialize();
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "flatland_project.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  undo() {
    // Save is a one-way action, optionally no-op or show a toast
  }
}
