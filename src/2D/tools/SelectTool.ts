import { Vector2 } from "three";
import { pushCommand } from "../../Command";
import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { drawCanvasFromState, drawSelectionMovePreview } from "../canvas";
import { PathToolCommand } from "../commands/PathToolCommand";
import { PathToolDeselectCommand } from "../commands/PathToolDeselectCommand";
import { PathToolMovePointCommand } from "../commands/PathToolMovePointCommand";
import { PathToolSelectCommand } from "../commands/PathToolSelectCommand";
import { findNearestPoint } from "../geometry/findNearestPoint";
import { cLocalizePoint } from "../pointer/cLocalizePoint";
import { selectionRadius } from "../settings/interface";
import { PathToolState } from "./PathTool";

export type SelectToolState = 
  | { type: "idle" }
  | { type: "hovering"; hoveredIndex: number }
  | { type: "moving"; selectedIndices: number[]; startPos: Vector2 }
  | { type: "selecting"; selectedIndices: number[], hitIndex: number; }

export class SelectTool implements ToolBase {
  // Tool state object stores tool mechanical state
  private __state:SelectToolState = { type: "idle" };

  // Tool name
  readonly name:ToolName = 'select';

  // Index of currently selected object
  private __currentObjectIndex: number;

  constructor() {
  }

  public initializeEvents():void {
    const canvas = state.canvas;
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  // Tool state replacer
  private transition(newState: SelectToolState) {
    console.log(`PathTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Path tool event management
  private onMouseDown(e: MouseEvent) {

  }

  private onMouseMove(e: MouseEvent) {

  }

  private onMouseUp(e: MouseEvent) {

  }
}
