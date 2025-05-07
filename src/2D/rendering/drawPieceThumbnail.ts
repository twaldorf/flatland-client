import { Ref } from "react";
import { state } from "../../State";
import { Geometry2D, Piece } from "../../types";
import { getGeometryBoundingRect, getShapeBoundingRect } from "../geometry/boundingBox";
import { drawShapeNormalized } from "./drawPaths";
import { getBuffer, getOnscreenBuffer } from "./getBuffer";
import { getPointArray } from "../geometry/getPointArrayFromGeometry2D";
import { Vector2 } from "three";

// Apply the thumbnail to the canvas
export function drawPieceThumbnail(piece:Piece, canvas: HTMLCanvasElement) {

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  if (piece.canvas) context.drawImage(piece.canvas, 0, 0);
}

// draw the shape to an offscreen canvas, this should be called as the piece is made or updated
export function generatePieceThumbnail( piece:Piece ) {
  const { context, canvas } = getBuffer(`preview_${piece.name}`);

  console.log(piece, 'gen piece')

  const box = getGeometryBoundingRect( getPointArray(piece.geometryId) as Vector2[] );

  canvas.width = box.x1 - box.x0 + 1;

  canvas.height = box.y1 - box.y0 + 1;

  drawShapeNormalized( piece.geometryId, context);

  return canvas;
}
