import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { BezierPoint, Geometry2D } from "../../types";
import { drawCanvasFromState } from "../rendering/canvas";

export class PathToolAddBezierCommand implements Command {
  // The origin of the click
  private anchor: Vector2;

  // The position of the cursor at the end of the click
  private pos: Vector2;

  // The last point in the path
  private prevPoint: BezierPoint;

  private geometryId:string;

  constructor(geometryId: string, anchor:Vector2, pos:Vector2, prev?:BezierPoint) {
    this.anchor = anchor;
    this.pos = pos;
    this.geometryId = geometryId;

    if (prev) {
      this.prevPoint = prev
    } else {
      // If this is the first point, the origin is the anchor
      this.prevPoint = { to: anchor };
    }
  }

  do() {
    const backHandle = this.pos.clone().rotateAround(this.anchor, Math.PI);

    // Bezier point object containing Indices
    const bPoint:BezierPoint = { 
      to: 
      this.anchor.clone(),
      c1: 
      this.pos.clone(),
      c2:
      backHandle.clone(),
      from:
      this.prevPoint.to.clone(),
    }

    const id = state.addGeometryPoint(bPoint);

    var geometry = state.c_geometryMap.get(this.geometryId) as Geometry2D;
    if (!geometry) {
      geometry = {
        type: 'bezier',
        pointIds: [],
      }
    }
    geometry.pointIds = [ ...geometry.pointIds, id ];
    state.c_geometryMap.set(this.geometryId, geometry);

    drawCanvasFromState(state);
  }

  undo() {
    console.log('not yet implemented')
  }
}
