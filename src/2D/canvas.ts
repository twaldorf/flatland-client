import { Vector2 } from "three";
import { BufferBundle, BufferType, DrawableEntity, State } from "../types";
import { rad, rulerHeight, rulerWidth } from "./settings/interface";
import { state } from "../State";
import { cf_canvas_to_inch } from "./settings/factors";
import { c_bgColor } from "../UI/colors/colors";

export function drawCanvasSetup() {
  state.context.fillStyle = c_bgColor;
  state.context.fillRect(0, 0, state.canvas.width, state.canvas.height);
  drawCanvasFromState(state);
  drawYRuler();
  drawGridRuler();
}

export function drawCanvasFromState(state:State):void {
  erase();
  drawPaths(state);
  drawSelections();
  drawPoints(state);
  // drawShapes();
}

export function redrawCanvas():void {
  erase();
  applyPoints();
  applyPaths();
  applyGridRuler();
}

function erase() {
  state.context.fillStyle = c_bgColor;
  // Draw a background color rectangle from the start of the ruler to the bottom of the canvas
  state.context.fillRect(rulerWidth, rulerHeight, state.canvas.width, state.canvas.height);
  // drawGridRuler();
  applyGridRuler();
}


// Get or create and return a buffer bundle
// A created buffer bundle has a 0 area canvas
function getBuffer(buffer:BufferType):BufferBundle {
  // Get or create the canvas and context for the preview buffer
  let bundle = state.c_buffers.get(buffer);
  if ( !bundle || !bundle.context || !bundle.canvas ) {
    const canvas = new OffscreenCanvas(0, 0);
    const ctx = canvas.getContext('2d') as OffscreenCanvasRenderingContext2D;
    bundle = { canvas, context: ctx };
    state.c_buffers.set( buffer, bundle );
  }

  return bundle;
}

// Assuming only one active object, draw it
// TODO: draw a tree of paths, or rather a 2d array of paths
const drawPoints = (state:State) => {

  const { canvas, context } = getBuffer('points');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  state.c_pointmap.forEach((e:Vector2) => {
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.beginPath();
    context.arc(e.x - rad / 2 + 2, e.y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  })

  state.context.drawImage(canvas, 0, 0);
}


function applyPoints() {
  const obj = state.c_buffers.get('points');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}

function applyGridRuler() {
  const obj = state.c_buffers.get('grid');
  if (obj) state.context.drawImage(obj.canvas, 0, 0);
}

// Draw paths AND shapes
const drawPaths = (state:State)  => {
  const { canvas, context } = getBuffer('paths');

  canvas.width = state.canvas.width;
  canvas.height = state.canvas.height;

  const _ = context;

  // Make sure this is not a copy op
  const paths = state.c_paths;

  paths.forEach( ( points, i ) => {
    // points is the array of point indices within state.c_points, i is the path index, not important
    drawArrayOfPointIndices(points, context)
  });

  if (state.c_shapes.length > 0) {
    // draw shapes
    state.c_shapes.forEach( ( shapeArr ) => {
      drawArrayOfPointIndices( shapeArr, context );
      drawPolygonFromPointIndices( shapeArr, context );
    })
  }

  state.context.drawImage(canvas, 0, 0);
}

function applyPaths() {
  const obj = state.c_buffers.get('paths');
  if (obj) state.context.drawImage(obj.canvas, 0, 0); 
}

function drawPolygonFromPointIndices( points: number[], context:OffscreenCanvasRenderingContext2D ) {
  const _ = context;
  if (points.length > 0) {
    _.beginPath();
    _.fillStyle = '#B9C4EC';
    _.strokeStyle = 'black';

    const firstPoint = point(points[0]);
    _.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < points.length; ++i) {
      const p = point(points[i]);
      _.lineTo(p.x, p.y);
    }

    _.lineTo(firstPoint.x, firstPoint.y);
    _.fill();
    _.stroke();
  } 
}

function drawArrayOfPointIndices( points: number[], context:OffscreenCanvasRenderingContext2D ):void {
  const _ = context;
    if (points.length > 0) {
      _.beginPath();
      _.strokeStyle = 'black';
      const firstPoint = point(points[0]);
      _.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < points.length; ++i) {
        _.lineTo(point(points[i]).x, point(points[i]).y);
        _.moveTo(point(points[i]).x, point(points[i]).y);
      }
    } 
    _.stroke();
}

function point(index:number):Vector2 {
  return state.c_points[index];
}

const drawSelections = () => {
 state.c_selected.map((index:number) => {
    state.context.fillStyle = 'black';
    state.context.strokeStyle = 'black';
    state.context.beginPath();
    state.context.arc(state.c_points[index].x - rad / 2 + 2, state.c_points[index].y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    state.context.fill();
    state.context.stroke();
  })
}

export function drawSelectionMovePreview(pos: Vector2): void {
  drawCanvasFromState(state);
  state.context.fillStyle = 'pink';
  state.context.fillRect(pos.x - 5, pos.y - 5, 10, 10); 
}

export function drawDrawPreview(from:Vector2, to:Vector2): void {
  // Find the vertical and horizontal distances between the points
  const h = Math.abs(from.y - to.y);
  const w = Math.abs(from.x - to.x);

  // Bail if the cursor is within the point icon
  if (h * w < rad) {
    return;
  }

  const bundle = getBuffer('preview');

  const ctx = bundle.context;
  const canvas = bundle.canvas;

  // Prevent the canvas from getting smaller
  canvas.height = canvas.height > h ? canvas.height : h + 10;
  canvas.width = canvas.width > w ? canvas.width : w + 10;

  const originX = from.x > to.x ? to.x : from.x;
  const originY = from.y > to.y ? to.y : from.y;

  // Clear the canvas
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  // 2nd and 4th quadrants
  if ( (from.x > to.x && from.y > to.y) || (from.x < to.x && from.y < to.y)) {
    // ctx.fillStyle = c_bgColor;
    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
  } else {
  // 1st and 3rd quadrants
    // ctx.fillStyle = c_bgColor;
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
  }
  ctx.stroke();

  ctx.fillText(`${Math.round(from.distanceTo(to)) / cf_canvas_to_inch}in`, w / 2 - 5, h / 2 - 5);

  redrawCanvas();
  state.context.drawImage(canvas, originX, originY);
}

export function drawYRuler() {
  const bundle = getBuffer('grid');

  const ctx = bundle.context;
  const bufferCanvas = bundle.canvas;

    // Buffer
  bufferCanvas.width = 10;
  bufferCanvas.height = state.canvas.height;

  ctx.lineWidth = 1;

  // Draw inches
  for (let i = 1; i < bufferCanvas.height; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.lineTo(10, i * cf_canvas_to_inch  * state.c_zoomfactor);
    ctx.stroke();
  }

  // Draw inches
  for (let i = 1; i < bufferCanvas.height; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * .25 * state.c_zoomfactor);
    ctx.lineTo(2.5, i * cf_canvas_to_inch * .25  * state.c_zoomfactor);
    ctx.stroke();
  }

  state.context.drawImage(bufferCanvas, 0, 0);
}

export function drawGridRuler() {
  const bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = state.canvas.width;
  bufferCanvas.height = state.canvas.height;
  const ctx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';

  // Draw inches
  for (let i = 25; i < bufferCanvas.height - 25; ++i) {
    ctx.moveTo(0, i * cf_canvas_to_inch * state.c_zoomfactor);
    ctx.lineTo(10, i * cf_canvas_to_inch  * state.c_zoomfactor);
    ctx.stroke();
  }

  // Draw inches
  for (let i = 25; i < bufferCanvas.height - 25; ++i) {
    ctx.moveTo(i * cf_canvas_to_inch * .25 * state.c_zoomfactor, 0);
    ctx.lineTo(i * cf_canvas_to_inch * .25  * state.c_zoomfactor, 25);
    ctx.stroke();
  }

  state.context.drawImage(bufferCanvas, 0, 0); 
}