import { pushCommand } from "../../Command";
import { state } from "../../State";
import { ToolBase } from "../../types";
import { MeasureToolAddPointCommand } from "../commands/MeasureToolAddPointCommand";
import { MeasureToolClosePathCommand } from "../commands/MeasureToolClosePathCommand";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { drawCanvasFromState } from "../rendering/canvas";
import { drawDrawPreview } from "../rendering/drawDrawPreview";


export type MeasureToolState = 
  | { type: "idle" }
  | { type: "drawing", currentPathIndex:number }

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
        this.transition({type: 'drawing', currentPathIndex: state.c_measure_paths.length});
        pushCommand(new MeasureToolAddPointCommand(pos, state.c_measure_paths.length));
        break;

      case ("drawing"):
        if (state.altDown) {
          pushCommand(new MeasureToolAddPointCommand(pos, this.__state.currentPathIndex)); 
        } else {
          pushCommand(new MeasureToolClosePathCommand(pos, this.__state.currentPathIndex));
          this.transition({ type: 'idle' });
        }
        break;
        
      default:
        break;
    }
    
    drawCanvasFromState(state);
  }

  private onMouseMove(e: MouseEvent) {
    switch (this.__state.type) {
      case ("idle"):
        break;

      case ("drawing"):
        if (state.c_measure_paths[this.__state.currentPathIndex]) {
          drawDrawPreview(state.c_measure_points.get(state.c_measure_paths[ this.__state.currentPathIndex ][0]), cLocalizePoint(e.clientX, e.clientY));
        }
        break;
        
      default:
        break;
    }
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
