import { Path, Vector2 } from "three";
import { Command } from "../../Command";
import { state } from '../../State.ts';
import { cLocalizePoint } from "../pointer/cLocalizePoint.ts";
import { PathTool } from "../tools/PathTool.ts";
import { rad } from "../settings/interface.ts";

export class PathToolCommand implements Command {
  __points:THREE.Vector2[];
  __point:Vector2;
  tool:PathTool;

  // Dangerous misuse of Command pattern here
  constructor(tool:PathTool, point:Vector2) {
    this.tool = tool;
    this.__point = point;
  }

  do() {
    state.context.fillStyle = 'black';
    state.context.strokeStyle = 'black';
    state.context?.fillRect(state.pointer.x - rad / 2 - rad / 4, state.pointer.y - rad / 2 - rad / 4, rad, rad);
    if (this.tool.drawing == true) {
      this.tool.push( this.__point );
      state.context?.lineTo(this.__point.x, this.__point.y);
      state.context?.stroke();
    } else {
      this.tool.drawing = true;
      console.log('begin path');
      state.context?.beginPath();
      state.context?.moveTo(this.__point.x, this.__point.y);
      this.tool.push( this.__point ); 
    }
  }

  undo() {
    // TODO: Implement draw Undo
  }

}