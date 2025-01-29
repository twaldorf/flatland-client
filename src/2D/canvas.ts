import { Vector2 } from "three";
import { DrawableEntity, State } from "../types";
import { rad } from "./settings/interface";
import { state } from "../State";

export function drawCanvasFromState(state:State):void {
  clearCanvas(state);
  drawPoints(state);
  drawPaths(state);
  drawSelections(state);
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
  if (p.length > 0) {
    _.beginPath();
    _.strokeStyle = 'black';
    _.moveTo(p[0].x, p[0].y);
    for (let i = 1; i < state.c_points.length; ++i) {
      _.lineTo(p[i].x, p[i].y);
      _.moveTo(p[i].x, p[i].y);
    }
    _.stroke();
  }
}

const drawSelections = () => {
 state.c_selected.map((index:number) => {
   state.context.fillStyle = 'blue';
   state.context.fillRect(state.c_points[index].x - 5, state.c_points[index].y - 5, 10, 10);
  })
}