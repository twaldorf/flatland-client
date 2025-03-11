import { pushCommand } from "../../Command";
import { state } from "../../State";
import { ToolBase } from "../../types";
import { MeasureToolAddPointCommand } from "../commands/MeasureToolAddPointCommand";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { drawCanvasFromState } from "../rendering/canvas";


export type MeasureToolState = 
  | { type: "idle" }
  | { type: "drawing" }

export class MeasureTool implements ToolBase {
  private __state:MeasureToolState = { type: "idle" };

  // Tool name
  readonly name:string = 'measure';

  private __length: number;
  
  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this)
  } 

  constructor() {
    this.__length = 0;
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

  // Tool state management
  private transition(newState: MeasureToolState) {
    console.log(`MeasureTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Tool event management
  private onMouseDown(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);
    state.pointer = pos;

    switch (this.__state.type) {
      case ("idle"):
        pushCommand(new MeasureToolAddPointCommand(pos));
        this.transition({type: 'drawing'});
        break;

      case ("drawing"):
        pushCommand(new MeasureToolAddPointCommand(pos));
        break;
        
      default:
        break;
    }
    
    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    // TODO: Add measuring logic
  }

  private onMouseUp(e: MouseEvent) {
    const pos = cLocalizePoint(e.clientX, e.clientY);

    switch (this.__state.type) {
      default:
        break;
    }

    // drawCanvasFromState(state);
  }

  get state():MeasureToolState {
    return this.__state;
  }

}
