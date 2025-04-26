import { ToolBase } from "../../types";
import { state } from "../../State";
import { drawCanvasFromState, redrawCanvas } from "../rendering/canvas";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { findNearestPoint } from "../geometry/findNearestPoint";
import { useAppState } from "../../UI/store";
import { Vector, Vector2 } from "three";
import { drawDrawPreview } from "../rendering/drawDrawPreview";
import { pushCommand } from "../../Command";
import { GrainlineToolCreateGrainlineCommand } from "../commands/GrainlineToolCreateGrainlineCommand";
import { isPointInPolygon } from "../geometry/isPointInPolygon";

export type GrainlineToolState = 
  | { type: "idle" }
  | { type: "drawing"; originPos: Vector2 }

export class GrainlineTool implements ToolBase {
  // Tool state object stores tool mechanical state, no data
  private __state:GrainlineToolState = { type: "idle" };

  // Tool name
  readonly name:string = 'grainline';

  private unitVector:Vector2 = new Vector2(0, -1);

  // Last set angle of grainline in radians where 0 and 2PI is the "top" i.e. north of the unit circle
  private angle:number;
  
  private setPointer = useAppState.getState().setPointer;
  
  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this)
  } 

  constructor() {
    this.angle = 0;
  }

  public initializeEvents() {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.__listeners.down);
    canvas.addEventListener("mousemove", this.__listeners.move);
    canvas.addEventListener("mouseup", this.__listeners.up);
  }

  public dismountEvents() {
    state.canvas.removeEventListener('mousedown', this.__listeners.down);
    state.canvas.removeEventListener("mousemove", this.__listeners.move);
    state.canvas.removeEventListener("mouseup", this.__listeners.up);
  }

  get state():GrainlineToolState {
    return this.__state;
  }

  // Tool state management
  private transition(newState: GrainlineToolState) {
    console.log(`Tool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
    drawCanvasFromState(state);
  }

  // Tool event management
  private onMouseDown(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    // state.pointer = pos;
    const selectedShapeIndex = this.checkForShapeOverlap(pos);

    if (selectedShapeIndex > -1) {

      switch (this.__state.type) {
        case "idle":
          this.transition({ type: 'drawing', originPos: pos });
          break;
          
        default:
          break;
      }
    }

    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    state.pointer = pos;

    this.setPointer(state.pointer);

    switch (this.__state.type) {
      case "drawing":
        drawDrawPreview(this.__state.originPos, pos);
        break;
    }

  }

  private onMouseUp(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    switch (this.__state.type) {
      case "drawing":
        this.angle = this.angleFromNoon(pos, this.__state.originPos);
        pushCommand(new GrainlineToolCreateGrainlineCommand(this.__state.originPos, state.c_selected_shapes[0], this.angle));
    }
    this.transition({ type: "idle" });
  }

  public checkForShapeOverlap(pos:Vector2):number {
    let value = -1;
    state.c_shapes.forEach((shape, index) => {
      const shapePoints = shape.map((pointIndex) => state.c_points[pointIndex]);
      if (isPointInPolygon(pos, shapePoints)) {
        value = index;
      }
    });
    return value;
  }

  private angleFromNoon(vector:Vector2, origin:Vector2) {
    vector = vector.sub(origin);
    let baseAngle = Math.atan2(vector.y, vector.x);
  
    let ang = baseAngle;

    // Map to [0, 2pi]
    if (ang < 0) ang += 2 * Math.PI;
    return ang;
  }

}
