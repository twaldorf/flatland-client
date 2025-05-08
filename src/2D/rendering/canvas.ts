import { Vector2 } from "three";
import { DrawableEntity, State } from "../../types";
import { rulerHeight, rulerWidth } from "../settings/interface";
import { state } from "../../State";
import { c_bgColor } from "../../UI/colors/colors";
import { drawPoints, applyPoints } from "./drawPoints";
import { drawPaths, applyPaths } from "./drawPaths";
import { drawSelections } from "./drawSelections";
import { drawYRuler, drawGridRuler } from "./drawRulers";
import { applyCursorPreview, drawCursorPreview } from "./drawCursorPreview";
import { applyMeasurements, drawMeasurements } from "./drawMeasurements";
import { applyBeziers, drawBeziers } from "./drawBeziers";
import { applyDrawPreviews } from "./drawNewPointPreview";
import { drawDrawPreview } from "./drawDrawPreview";

// 2D Canvas Renderer

export function drawCanvasSetup() {
  state.context.fillStyle = c_bgColor;
  state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
  drawCanvasFromState(state);
  // drawYRuler();
  drawGridRuler();
}

export function drawCanvasFromState(state:State):void {
  erase();
  drawPaths(state);
  drawBeziers(state);
  drawSelections(state);
  drawPoints(state);
  drawCursorPreview(state.pointer);
  drawMeasurements(state);
  // drawShapes();
}

export function redrawCanvas():void {
  erase();
  applyGridRuler();
  applyPoints();
  applyPaths();
  applyBeziers(state.context);
  // applyShapes();
  applyCursorPreview();
  applyDrawPreviews();
  applyMeasurements();
}

function erase() {
  state.context.fillStyle = c_bgColor;
  // Draw a background color rectangle from the start of the ruler to the bottom of the canvas
  state.context.fillRect(rulerWidth, rulerHeight, state.canvas.width, state.canvas.height);
  // drawGridRuler();
  applyGridRuler();
}


function applyGridRuler() {
  const obj = state.c_buffers.get('grid');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}


export function point(index:number):Vector2 {
  return state.c_points[index];
}

