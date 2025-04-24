import { ToolBase } from "../../types";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { findNearestPoint } from "../geometry/findNearestPoint";
import { useAppState } from "../../UI/store";

export type GrainlineToolState = 
  | { type: "idle" }
  | { type: "drawing"; angle: number }

export class GrainlineTool implements ToolBase {
  // Tool state object stores tool mechanical state, no data
  private __state:GrainlineToolState = { type: "idle" };

  // Tool name
  readonly name:string = 'grainline';

  // Current angle of grainline in radians where 0 and 2PI is the "top" i.e. north of the unit circle
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
    // const pos = cLocalizePoint(e.clientX, e.clientY);
    // state.pointer = pos;
    // const hitIndex = findNearestPoint(pos, state.c_points);

    switch (this.__state.type) {
      case "idle":
      this.transition({type: 'drawing', angle:0});
      break;

      default:
        break;
    }

    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    state.pointer = pos;

    this.setPointer(state.pointer);

    switch (this.__state.type) {

    }

  }

  private onMouseUp(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
  }

}
