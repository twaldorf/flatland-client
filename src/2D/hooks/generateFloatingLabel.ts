import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { state } from "../../State";
import { Piece } from "../../types";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";
import { getPointArray } from "../geometry/getPointArrayFromGeometry2D";
import { useAppState } from "../../UI/store";

export const generateFloatingLabel = (geomId:string):void => {
  const pointList = getPointArray(geomId) as Vector2[];
  const box = getShapeBoundingRect(pointList);
  const dim = getShapeDimensions(pointList);
  const rect = state.canvas.getBoundingClientRect();

  // Generate a point in the upper left hand corner of the shape in windowspace
  const labelPoint = new Vector2(box.x0 + rect.x, box.y0 + rect.y);
  
  const pieceIndex = useAppState.getState().pieces.findIndex((piece) => piece.geometryId == geomId);
  
  let piece:Piece;
  if (pieceIndex < 0) {
    piece = {
      id: generateUUID(),
      geometryId: geomId
    }
  } else {
    piece = useAppState.getState().pieces[pieceIndex];
  }
  
  useAppState.getState().labelPiece(labelPoint, piece);
}