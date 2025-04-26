import { Vector2 } from "three";
import { Command } from "../../Command";
import { Grainline } from "../../types";
import { state } from "../../State";

export class GrainlineToolCreateGrainlineCommand implements Command {

  grainline:Grainline;
  shapeIndex:number;

  constructor(position: Vector2, shapeIndex: number, angle:number) {
    this.shapeIndex = shapeIndex;

    this.grainline = {
      position,
      angle,
    }
  }
  
  do() {
    state.c_grainlines.set(this.shapeIndex, this.grainline);
  }

  undo() {
    state.c_grainlines.delete(this.shapeIndex);
  }
}