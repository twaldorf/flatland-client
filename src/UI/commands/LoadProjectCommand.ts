import { drawCanvasFromState } from "../../2D/rendering/canvas";
import { Command } from "../../Command";
import { state } from "../../State";
import { State } from "../../types";
import { useAppState } from "../AppState";

export class LoadProjectCommand implements Command {

  private key: string;

  constructor(key:string) {
    this.key = key.replace('flatland-project-', '');
    console.log("KEY", key)
  }

  do() {
    const json = localStorage.getItem(`flatland-project-${this.key}`);
    console.log(json)
    if (!json) return;
    const data = json;
    const {c_pointsMap, c_geometryMap, projectInfo, pieces} = state.deserialize(data);

    console.log(c_pointsMap);

    state.c_pointsMap = c_pointsMap;
    state.c_geometryMap = c_geometryMap;
    state.projectInfo = projectInfo;
    state.pieces = pieces;

    useAppState.getState().setPieces(pieces);
    drawCanvasFromState(state);
  }

  undo() {
    // No undo for load
  }
}