import { Vector2 } from "three";
import { generateUUID } from "three/src/math/MathUtils";
import { state } from "../../State";
import { Piece } from "../../types";
import { useAppState } from "../../UI/store";
import { getShapeBoundingRect, getShapeDimensions } from "../geometry/boundingBox";

export const generateFloatingLabel = (shapeIndex:number):void => {
  const box = getShapeBoundingRect(state.c_shapes[shapeIndex]);
  const dim = getShapeDimensions(state.c_shapes[shapeIndex]);
  const rect = state.canvas.getBoundingClientRect();

  // Generate a point in the upper left hand corner of the shape in windowspace
  const labelPoint = new Vector2(box.x0 + rect.x, box.y0 + rect.y);
  
  const pieceIndex = useAppState.getState().pieces.findIndex((piece) => piece.shapeIndex == shapeIndex);
  
  let piece:Piece;
  if (pieceIndex < 0) {
    piece = {
      id: generateUUID(),
      shapeIndex: shapeIndex
    }
  } else {
    piece = useAppState.getState().pieces[pieceIndex];
  }
  
  useAppState.getState().labelPiece(labelPoint, piece);
}