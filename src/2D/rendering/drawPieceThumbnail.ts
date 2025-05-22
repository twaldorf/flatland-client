import { Ref } from "react";
import { state } from "../../State";
import { Geometry2D, Piece } from "../../types";
import { getGeometryBoundingRect, getShapeBoundingRect } from "../geometry/boundingBox";
import { drawShapeNormalized } from "./drawPaths";
import { getBuffer, getOnscreenBuffer } from "./getBuffer";
import { getPointArray } from "../geometry/getPointArrayFromGeometry2D";
import { Vector2 } from "three";

// Apply the thumbnail to the canvas
export function drawPieceThumbnail(piece: Piece, domCanvas: HTMLCanvasElement) {
  const domContext = domCanvas.getContext("2d") as CanvasRenderingContext2D;
  domContext.clearRect(0, 0, domCanvas.width, domCanvas.height);

  if (!piece.canvas) return;

  const srcCanvas = piece.canvas;
  const srcWidth = srcCanvas.width;
  const srcHeight = srcCanvas.height;
  const dstWidth = domCanvas.width;
  const dstHeight = domCanvas.height;

  // Calculate scale to fit while preserving aspect ratio
  const scale = Math.min(dstWidth / srcWidth, dstHeight / srcHeight);

  const drawWidth = srcWidth * scale;
  const drawHeight = srcHeight * scale;

  // Center the image
  const offsetX = (dstWidth - drawWidth) / 2;
  const offsetY = (dstHeight - drawHeight) / 2;

  domContext.drawImage(srcCanvas, 0, 0, srcWidth, srcHeight, offsetX, offsetY, drawWidth, drawHeight);
}

// draw the shape to an offscreen canvas, this should be called as the piece is made or updated
export function generatePieceThumbnail( piece:Piece ) {
  const { context, canvas } = getBuffer(`preview_${piece.name}`);

  const box = getGeometryBoundingRect( getPointArray(piece.geometryId) as Vector2[] );

  const curveBuffer = 100;

  canvas.width = box.x1 - box.x0 + 1 + curveBuffer;

  canvas.height = box.y1 - box.y0 + 1 + curveBuffer;

  drawShapeNormalized( piece.geometryId, context);

  return canvas;
}
