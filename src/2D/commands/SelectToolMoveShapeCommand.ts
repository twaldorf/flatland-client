import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { computeCentroid } from "../geometry/centroid";
import { BezierPoint, Geometry2D } from "../../types";

export class SelectToolMoveShapeCommand implements Command {
  private geoms:string[];
  // private __from:Vector2;
  // private __to:Vector2;
  private __diff:Vector2;

  constructor(geoms:string[], from:Vector2, to:Vector2) {
    this.geoms = geoms;
    // this.__from = from.clone();
    // this.__to = to.clone();
    this.__diff = to.clone().sub(from);
  }

  do() {
    state.c_selectedGeometries.forEach((geomId: string) => {
      const geom = state.c_geometryMap.get(geomId);
      if (!geom) return;
    
      const uniqueIds = Array.from(new Set(geom.pointIds));
    
      uniqueIds.forEach(id => {
        const bp = state.c_pointsMap.get(id) as BezierPoint;
        if (!bp) return;
    
        bp.to.add(this.__diff);
        // bp.from.add(this.__diff); // Do not modify this vector in this sweep–it is the previous point's .to vector
        bp.c1.add(this.__diff);
        bp.c2.add(this.__diff);
      });
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