import { drawCanvasFromState } from "../../2D/rendering/canvas";
import { Command } from "../../Command";
import { state } from "../../State";
import { useAppState } from "../AppState";

export class LoadProjectCommand implements Command {

  private key: string;

  constructor(key:string) {
    this.key = key;
  }

  do() {
    const json = localStorage.getItem(this.key);
    if (!json) return;
    const data = json;
    state.deserialize(data);
    useAppState.getState().setPieces(state.pieces);
    drawCanvasFromState(state);
  }

  undo() {
    // No undo for load
  }
}