import { Command } from "../../Command";
import { ToolName } from "../../types";
import { changeTool } from "../tools/changeTool";


export class ChangeToolCommand implements Command {
  private __type: ToolName;

  constructor(type:string) {
    this.__type = type as ToolName;
  }

  do() {
    changeTool({ type: this.__type })
  }

  undo() {
    // TODO
    console.log('Undo not yet implemented for ChangeToolCommand');
  }
}