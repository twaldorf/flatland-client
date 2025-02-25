import { Ref } from "react";
import { state } from "../../State";
import { Piece } from "../../types";
import { getShapeBoundingRect } from "../geometry/boundingBox";
import { drawShapeNormalized } from "./drawPaths";
import { getBuffer, getOnscreenBuffer } from "./getBuffer";

export function drawPieceThumbnail(piece:Piece, canvas: HTMLCanvasElement) {

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  // const { context, canvas } = getOnscreenBuffer(`preview_${piece.id}`);

  const box = getShapeBoundingRect(state.c_shapes[piece.shapeIndex]);

  canvas.width = box.x1 - box.x0;

  canvas.height = box.y1 - box.y0;

  drawShapeNormalized(state.c_shapes[piece.shapeIndex], context);

  piece.thumb = canvas;
}