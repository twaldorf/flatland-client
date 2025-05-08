import { Vector, Vector2 } from "three";
import { pushCommand } from "../../Command";
import { state } from "../../State";
import { BezierPoint, Geometry2D, Piece, ToolBase, ToolName } from "../../types";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { SelectToolShapeCommand } from "../commands/SelectToolShapeCommand";
import { isPointInPolygon } from "../geometry/isPointInPolygon";
import { SelectToolMoveShapeCommand } from "../commands/SelectToolMoveShapeCommand"
import { checkPointOverlap } from "./common";
import { SelectToolPointCommand } from "../commands/SelectToolPointCommand";
import { SelectToolDeselectAllCommand } from "../commands/SelectToolDeselectAllCommand";
import { drawCanvasFromState, point, redrawCanvas } from "../rendering/canvas";
import { drawShapeSelectionMovePreview } from "../rendering/drawSelectionMovePreview";

import { KeyboardEvent } from "react";
import { DeleteShapeCommand } from "../commands/DeleteShapeCommand";
import { checkLineIntersection, LineHit } from "../geometry/lineIntersection";
import { SelectToolSelectLineCommand } from "../commands/SelectToolSelectLineCommand";
import { SelectToolAddShapeCommand } from "../commands/SelectToolAddShapeCommand";
import { SelectToolDeselectLinesCommand } from "../commands/SelectToolDeselectLinesCommand";
import { DrawPreviewsCommand } from "../commands/Rendering/DrawPreviewsCommand";
import { findNearestAnyPoint, findNearestGeometryPoint } from "../geometry/findNearestPoint";
import { isPointNearBezierGeometry } from "../geometry/bezierIntersection";
import { rad } from "../settings/interface";
import { SelectToolDeselectPointCommand } from "../commands/SelectToolDeselectPointCommand";
import { SelectToolMovePointsCommand } from "../commands/SelectToolMovePointsCommand";
import { ChangeToolCommand } from "../commands/ChangeToolCommand";

export type BezierPointEditorToolState = 
  | { type: "idle", pointId: string }
  | { type: "ready" }

export class BezierPointEditorTool implements ToolBase {
  // Tool state object stores tool mechanical state
  private __state:BezierPointEditorToolState;

  // Tool name
  readonly name:ToolName = 'bezier point editor';

  constructor(pointId:string) {
    this.__state = { type: "idle", pointId };
  }

  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this),
    // dblclick: this.onDoubleClick.bind(this)
  }

  public initializeEvents() {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.__listeners.down);
    canvas.addEventListener("mousemove", this.__listeners.move);
    canvas.addEventListener("mouseup", this.__listeners.up);
    // canvas.addEventListener("dblclick", this.__listeners.dblclick);
  }

  public applyState = (state: ToolBase["state"]) => {
    // Not implemented
  };

  public dismountEvents() {
    state.canvas.removeEventListener('mousedown', this.__listeners.down);
    state.canvas.removeEventListener("mousemove", this.__listeners.move);
    state.canvas.removeEventListener("mouseup", this.__listeners.up);
    // state.canvas.removeEventListener("dblclick", this.__listeners.dblclick);
  }

  // Tool state updater
  private transition(newState: BezierPointEditorToolState) {
    console.log(`SelectTool state: ${this.state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Select tool event management
  private onMouseDown(e: MouseEvent) {
    
    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    
  }

  private onMouseUp(e: MouseEvent) {
    
  }
   
  get state():BezierPointEditorToolState {
    return this.__state;
  }

}
