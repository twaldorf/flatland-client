import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class DeleteCommand implements Command {
  private deletedPoints: Array<{ index: number; point: Vector2 }>;

  constructor() {
    this.deletedPoints = state.c_selected.map((index) => ({
      index,
      point: state.c_points[index],
    }));
  }

  do() {
    // Remove selected points from the state
    state.c_selected.forEach((index) => {
      // Mark for removal
      state.c_points[index] = null as unknown as Vector2;
    });
    state.c_points = state.c_points.filter((p) => p !== null);
    state.c_selected = [];

    drawCanvasFromState(state);
  }

  undo() {
    // Restore deleted points
    this.deletedPoints.forEach(({ index, point }) => {
      state.c_points.splice(index, 0, point);
    });

    drawCanvasFromState(state);
  }
}
