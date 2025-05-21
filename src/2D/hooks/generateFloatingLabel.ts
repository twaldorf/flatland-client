import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { state } from "../../State";
import { Piece } from "../../types";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { getPointArray } from "../geometry/getPointArrayFromGeometry2D";
import { useAppState } from "../../UI/AppState";
import { usePiecesStore } from "../../UI/PiecesStore";

export const generateFloatingLabel = (geomId:string):void => {
  const pointList = getPointArray(geomId) as Vector2[];
  const box = getShapeBoundingRect(pointList);
  const dim = getShapeDimensions(pointList);
  const rect = state.canvas.getBoundingClientRect();

  // Generate a point in the upper left hand corner of the shape in windowspace
  const labelPoint = new Vector2(box.x0 + rect.x, box.y0 + rect.y);
  
  const pieceArr = Array.from(usePiecesStore.getState().pieces.values());
  const pieceId = pieceArr.filter((piece:Piece) => piece.geometryId === geomId)[0].id;
  const piece = usePiecesStore.getState().pieces.get(pieceId);

  if (!piece) return;
  
  useAppState.getState().labelPiece(pieceId);
  
}