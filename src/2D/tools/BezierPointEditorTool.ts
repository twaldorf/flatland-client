import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { drawCanvasFromState, point, redrawCanvas } from "../rendering/canvas";

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
