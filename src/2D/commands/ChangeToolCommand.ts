import { Command } from "../../Command";
import { state } from "../../State";
import { ToolBase, ToolName } from "../../types";
import { changeTool } from "../tools/changeTool";


export class ChangeToolCommand implements Command {
  private __type: ToolName;
  // private lastToolState: ToolBase["state"];

  constructor(type:string) {
    this.__type = type as ToolName;
    // this.lastToolState = state.tool.__state; // Not implemented: stateful tool swapping (for redo)
  }

  do() {
    changeTool({ name: this.__type })
  }

  undo() {
    changeTool({ name: this.__type })
    console.log('Undo not yet implemented for ChangeToolCommand');
  }
}