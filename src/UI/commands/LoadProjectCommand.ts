import { drawCanvasFromState } from "../../2D/rendering/canvas";
import { generatePieceThumbnail } from "../../2D/rendering/drawPieceThumbnail";
import { Command } from "../../Command";
import { state } from "../../State";
import { Piece, State } from "../../types";
import { useAppState } from "../AppState";
import { usePiecesStore } from "../PiecesStore";

export class LoadProjectCommand implements Command {

  private key: string;

  constructor(key:string) {
    this.key = key.replace('flatland-project-', '');
    console.log("KEY", key)
  }

  do() {
    const json = localStorage.getItem(`flatland-project-${this.key}`);
    if (!json) return;
    const data = json;
    const {c_pointsMap, c_geometryMap, projectInfo, pieces} = state.deserialize(data);

    state.c_pointsMap = c_pointsMap;
    state.c_geometryMap = c_geometryMap;
    state.projectInfo = projectInfo;

    usePiecesStore.getState().setPieces(pieces);

    // regenerate thumbnails
    Array.from(usePiecesStore.getState().pieces.values()).forEach((piece:Piece) => {
      piece.canvas = generatePieceThumbnail(piece);
    })

    drawCanvasFromState(state);
  }

  undo() {
    // No undo for load
  }
}