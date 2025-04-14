import { Vector2 } from "three";
import { Command } from "../../../Command";
import { drawShapeSelectionMovePreview } from "../../rendering/drawSelectionMovePreview";
import { redrawCanvas } from "../../rendering/canvas";

export class DrawPreviewsCommand implements Command {
  pos:Vector2;

  constructor(pos:Vector2) {
    this.pos = pos;
  }

  do() {
    redrawCanvas();
    drawShapeSelectionMovePreview(this.pos);
  }

  undo() {
    // do render commands have an undo?
  }
}