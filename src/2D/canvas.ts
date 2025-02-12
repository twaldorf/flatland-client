import { Vector2 } from "three";
import { DrawableEntity, State } from "../types";
import { rad } from "./settings/interface";
import { state } from "../State";
import { cf_canvas_to_inch } from "./settings/factors";

export function drawCanvasFromState(state:State):void {
  clearCanvas(state);
  drawPaths(state);
  drawPoints(state);
  drawSelections();
  // drawShapes();
}

const clearCanvas = (state:State) => {
  state.context.fillStyle = 'white';
  state.context.fillRect(10,0,state.canvas.width, state.canvas.height);
}

// Assuming only one active object, draw it
// TODO: draw a tree of paths, or rather a 2d array of paths
const drawPoints = (state:State) => {
  state.c_pointmap.forEach((e:Vector2) => {
    state.context.fillStyle = 'white';
    state.context.strokeStyle = 'black';
    state.context.beginPath();
    state.context.arc(e.x - rad / 2 + 2, e.y - rad / 2 + 2, rad, 0, 2 * Math.PI);
    state.context.fill();
    state.context.stroke();
  })
}

// Assuming only a single connected path, draw it
// TODO: draw a tree of such paths
const drawPaths = (state:State)  => {
  const _ = state.context;

  // Make sure this is not a copy op
  const paths = state.c_paths;

  paths.forEach( ( points, i ) => {
    // points is the array of point indices within state.c_points, i is the path index, not important
    drawArrayOfPointIndices(points)
  });

  if (state.c_shapes.length > 0) {
    // draw shapes
    state.c_shapes.forEach( ( shapeArr ) => {
      drawArrayOfPointIndices( shapeArr );
      drawPolygonFromPointIndices( shapeArr );
    })
  }
}

function drawPolygonFromPointIndices( points: number[] ) {
  const _ = state.context;
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

function drawArrayOfPointIndices( points: number[] ):void {
  const _ = state.context;
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

  // Get or create the canvas and context for the preview buffer
  var ctx; 
  var canvas;

  if (state.c_preview_context && state.c_preview_canvas) {
    ctx = state.c_preview_context;
    canvas = state.c_preview_canvas;
  } else {
    // canvas = document.createElement("canvas") as HTMLCanvasElement;
    canvas = new OffscreenCanvas(w, h)
    // ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx = canvas.getContext('2d');
    state.c_preview_canvas = canvas;
    state.c_preview_context = ctx;
  }

  // Prevent the canvas from getting smaller
  canvas.height = canvas.height > h ? canvas.height : h;
  canvas.width = canvas.width > w ? canvas.width : w;

  console.log(w,h, canvas.width, canvas.height)

  const originX = from.x > to.x ? to.x : from.x;
  const originY = from.y > to.y ? to.y : from.y;

  // Clear the canvas
  
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  
  // 2nd and 4th quadrants
  if ( (from.x > to.x && from.y > to.y) || (from.x < to.x && from.y < to.y)) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.moveTo(0, 0);
    ctx.lineTo(w, h);
  } else {
  // 1st and 3rd quadrants
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.height, canvas.width, 0);
    ctx.moveTo(0, h);
    ctx.lineTo(w, 0);
  }
  ctx.stroke();

  state.context.drawImage(canvas, originX, originY); 
}

export function drawYRuler() {
    // Buffer
  const bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = 10;
  bufferCanvas.height = state.canvas.height;
  const ctx = bufferCanvas.getContext("2d") as CanvasRenderingContext2D;

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