import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { computeCentroid } from "../geometry/centroid";
import { BezierPoint, Geometry2D } from "../../types";

export class SelectToolMovePointsCommand implements Command {
  
  private pointIds:string[];
  private diff: Vector2;

  constructor(pointIds:string[], from:Vector2, to:Vector2) {
    this.diff = to.clone().sub(from);
    this.pointIds = pointIds;
  }

  do() {
    this.pointIds.forEach((pid: string) => {
      const point = state.c_pointsMap.get(pid) as BezierPoint;
      if (!point) return;
      // Note the From component of the BezierPoint is not modified as it points to the previous point's To component
      point.to.add(this.diff);
      point.c1.add(this.diff);
      point.c2.add(this.diff);
    });

    // state.updateGrainlinePos( this.shapeIndex, computeCentroid( state.c_shapes[ this.shapeIndex ] ) );
    drawCanvasFromState(state);
  }

  undo() {
    // state.c_shapes[ this.shapeIndex ].forEach((i: number) => {
    //   state.c_points[i].sub(this.__diff); // Reverse the movement
    // });
    console.error('not implemented')
    drawCanvasFromState(state);
  }
}