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
import { CommonTool } from "./CommonTool";
import { localizePointerTo } from "../../pointer/LocalizePointerTo";

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
    console.log(`PathTool state: ${this.__state.type} → ${newState.type}`);
    this.__state = newState;
  }

  // Path tool event management
  private onMouseDown(e: MouseEvent) {
    const pos = localizePointerTo
  }

  private onMouseMove(e: MouseEvent) {

  }

  private onMouseUp(e: MouseEvent) {

  }
}
