import { generateUUID } from "three/src/math/MathUtils";
import { createPolygonPlane } from "../../3D/geometry/polygon";
import { Command, pushCommand } from "../../Command";
import { state } from "../../State";
import { Geometry2D, Piece } from "../../types";
import { drawCanvasFromState } from "../rendering/canvas";
import { generatePieceThumbnail } from "../rendering/drawPieceThumbnail";
import { useAppState } from "../../UI/AppState";
import { GenericLoadPieceCommand } from "./Generic/GenericLoadPieceCommand";
import { DEFAULT_SEAM_ALLOWANCE } from "../../constants";
import { usePiecesStore } from "../../UI/PiecesStore";


export class PathToolClosePathCommand implements Command {
  private geomId: string;
  private pieceId: string | null = null;

  constructor(geomId:string) {
    this.geomId = geomId;
  }

  do() {
    const geom = state.c_geometryMap.get(this.geomId);
    if (!geom || geom.pointIds.length < 3) return;

    // Close the loop by repeating the first point
    geom.pointIds.push(geom.pointIds[0]);
    geom.type = "shape";
    geom.id = this.geomId;
    state.c_geometryMap.set(this.geomId, geom);

    // Select the geometry
    state.c_selectedGeometries = [this.geomId];
    
    // Register Piece
    const piece: Piece = {
      id: generateUUID(),
      name: `piece${state.pieces.length + 1}`,
      geometryId: this.geomId.toString(),
      canvas: null!,
      thumb: null!,
      angle: 0,
      seamAllowance: DEFAULT_SEAM_ALLOWANCE,
      uiColor: '#fef9ef'
    };
    
    // generate thumbnail (mutation) & register with UI store
    piece.canvas = generatePieceThumbnail(piece);
    this.pieceId = piece.id;
    pushCommand(new GenericLoadPieceCommand(piece));

  }

  undo() {
    const geom = state.c_geometryMap.get(this.geomId);
    if (!geom) return;

    geom.pointIds.pop();
    geom.type = "path";
    state.c_geometryMap.set(this.geomId, geom);

    state.c_selectedGeometries = [];

    if (this.pieceId) {
      // useAppState.getState().removePiece(this.pieceId);
      this.pieceId = null;
    }

    drawCanvasFromState(state);
  }
}
