import { Vector2 } from "three";
import { Command } from "../../Command";
import { state } from "../../State";
import { drawCanvasFromState } from "../canvas";

export class SelectToolPointCommand implements Command {
  private __index:number;
  private __point:Vector2;

  constructor(index:number) {
    this.__index = index;
  }

  do() {
    // todo implement
  }

  undo() {
    // todo implement
  }

}