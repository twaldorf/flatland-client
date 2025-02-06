import { Vector2 } from "three";
import { pushCommand } from "../../Command";
import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { SelectShapeCommand } from "../commands/SelectShapeCommand";
import { isPointInPolygon } from "../geometry/isPointInPolygon";
import { SelectToolMoveShapeCommand } from "../commands/SelectToolMoveShapeCommand"

export type SelectToolState = 
  | { type: "idle" }
  | { type: "hovering"; hoveredIndex: number }
  | { type: "moving"; selectedShapeIndex: number; startPos: Vector2 }
  | { type: "selecting"; selectedShapeIndex: number }

export class SelectTool implements ToolBase {
  // Tool state object stores tool mechanical state
  private __state:SelectToolState = { type: "idle" };

  // Tool name
  readonly name:ToolName = 'select';

  constructor() {
  }

  private __listeners = {
    down: this.onMouseDown.bind(this),
    move: this.onMouseMove.bind(this),
    up: this.onMouseUp.bind(this)
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

  // Tool state replacer
  private transition(newState: SelectToolState) {
    console.log(`SelectTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Path tool event management
  private onMouseDown(e: MouseEvent) {
    const clickPos = cLocalizePoint(e.clientX, e.clientY);
    const selectedShapeIndex = this.checkForShapeOverlap(clickPos);

    switch (this.__state.type) {
      case "idle":
        console.log(selectedShapeIndex)
        if ( selectedShapeIndex > -1 ) {
          pushCommand( new SelectShapeCommand( selectedShapeIndex ) );
          this.transition({
            type: "selecting",
            selectedShapeIndex
          })
        }
        break;
      
      case "selecting":
        if (state.shiftDown) {
          if ( selectedShapeIndex > -1 ) {
            pushCommand( new SelectShapeCommand( selectedShapeIndex ) );
          } 
        }
    }
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

  private onMouseMove(e: MouseEvent) {
    switch (this.__state.type) {
      
      case 'selecting':
        this.transition({
          type: 'moving',
          selectedShapeIndex: this.__state.selectedShapeIndex,
          startPos: cLocalizePoint(e.clientX, e.clientY)
        });
        break;

    }
  }

  private onMouseUp(e: MouseEvent) {
    switch (this.__state.type) {
      case "moving":
        const endPos = cLocalizePoint(e.clientX, e.clientY);
        const shapeIndex = this.__state.selectedShapeIndex;
        const startPos = this.__state.startPos;
        pushCommand( new SelectToolMoveShapeCommand( shapeIndex, startPos, endPos ));
        this.transition({
          type: 'idle'
        });
    }
  }
}
