import { Vector2 } from "three";
import { DrawableEntity, State } from "../types";
import { rad } from "./settings/interface";
import { state } from "../State";

export function drawCanvasFromState(state:State):void {
  clearCanvas(state);
  drawPoints(state);
  drawPaths(state);
  drawSelections();
  // drawShapes();
}

const clearCanvas = (state:State) => {
  state.context.fillStyle = 'white';
  state.context.fillRect(0,0,state.canvas.width, state.canvas.height);
}

// Assuming only one active object, draw it
// TODO: draw a tree of paths, or rather a 2d array of paths
const drawPoints = (state:State) => {
  state.c_points.map((e:Vector2) => {
    state.context.fillStyle = 'black';
    state.context.strokeStyle = 'black';
    state.context.fillRect(e.x - rad / 2 - rad / 4, e.y - rad / 2 - rad / 4, rad, rad);
  })
}

// Assuming only a single connected path, draw it
// TODO: draw a tree of such paths
const drawPaths = (state:State)  => {
  const _ = state.context;

  // Make sure this is not a copy op
  const p = state.c_points;
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
    _.fillStyle = '#eee';
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
        console.log(point(points[i]))
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
   state.context.fillStyle = 'blue';
   state.context.fillRect(state.c_points[index].x - 5, state.c_points[index].y - 5, 10, 10);
  })
}

export function drawSelectionMovePreview(pos: Vector2): void {
  drawCanvasFromState(state);
  state.context.fillStyle = 'pink';
  state.context.fillRect(pos.x - 5, pos.y - 5, 10, 10); 
}