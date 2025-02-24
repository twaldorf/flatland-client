import { Vector2 } from "three";
import { pushCommand } from "../../Command";
import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { SelectToolShapeCommand } from "../commands/SelectToolShapeCommand";
import { isPointInPolygon } from "../geometry/isPointInPolygon";
import { SelectToolMoveShapeCommand } from "../commands/SelectToolMoveShapeCommand"
import { checkPointOverlap } from "./common";
import { SelectToolPointCommand } from "../commands/SelectToolPointCommand";
import { SelectToolDeselectAllCommand } from "../commands/SelectToolDeselectAllCommand";
import { redrawCanvas } from "../rendering/canvas";

export type SelectToolState = 
  | { type: "idle" }
  | { type: "hovering"; hoveredIndex: number }
  | { type: "moving"; selectedShapeIndex: number; startPos: Vector2 }
  | { type: "selecting"; selectedShapeIndex: number }
  | { type: "selecting_points"; selectedPointIndices: number[] }

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

  // Tool state updater
  private transition(newState: SelectToolState) {
    console.log(`SelectTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Select tool event management
  private onMouseDown(e: MouseEvent) {
    const clickPos = cLocalizePoint(e.clientX, e.clientY);
    const selectedShapeIndex = this.checkForShapeOverlap(clickPos);
    const hitIndex = checkPointOverlap(clickPos);

    switch (this.__state.type) {
      case "idle":
        if ( selectedShapeIndex > -1 ) {
          pushCommand( new SelectToolShapeCommand( selectedShapeIndex ) );
          this.transition({
            type: "selecting",
            selectedShapeIndex
          });
        } else if ( hitIndex && hitIndex > -1 ) {
          pushCommand( new SelectToolPointCommand( hitIndex ) );
          this.transition({
            type: "selecting_points",
            selectedPointIndices: [ hitIndex ]
          });
        }

        break;
      
      case "selecting":
        if (state.shiftDown) {
          if ( selectedShapeIndex > -1 ) {
            pushCommand( new SelectToolShapeCommand( selectedShapeIndex ) );
          } 
        }
        break;
      
      case "selecting_points":
        if ( hitIndex && hitIndex > -1) {
          if (state.shiftDown ) {
            if (state.c_selected.indexOf(hitIndex) === -1) {
              pushCommand( new SelectToolPointCommand( hitIndex ) );
            }
          } else {
            if (state.c_selected.indexOf(hitIndex) === -1) {
              pushCommand( new SelectToolPointCommand( hitIndex ) );
            } 
          }
        } else if ( !state.shiftDown ) {
          pushCommand( new SelectToolDeselectAllCommand() );
          this.transition({
            type: "idle"
          });
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

  public get state():SelectToolState {
    return this.__state;
  }
}
