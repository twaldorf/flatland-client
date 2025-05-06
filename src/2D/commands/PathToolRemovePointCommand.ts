import { Command } from "../../Command";
import { state } from "../../State";
import { Point } from "../../types";
import { drawCanvasFromState } from "../rendering/canvas";

export class PathToolRemovePointCommand implements Command {
  private geomId:string;
  private point:Point | undefined;
  private pid:string;
  private index:number | undefined;

  constructor( geomId: string, pid: string ) {
    this.geomId = geomId;
    this.pid = pid;
  }

  do() {
    const geom = state.c_geometryMap.get(this.geomId);
    if (geom) {
      var i;
      geom.pointIds = geom.pointIds.filter((id:string, index:number) => { 
        i = index;
        return id !== this.pid
      } );
      
      state.c_geometryMap.set(this.geomId, geom);
      this.index = i;

      this.point = state.c_pointsMap.get(this.pid);
      state.c_pointsMap.delete(this.pid);
    }

    drawCanvasFromState(state);
  }

  undo() {
    const geom = state.c_geometryMap.get(this.geomId);
    if (geom && this.index && this.point) {
      geom.pointIds = geom.pointIds.toSpliced(this.index, 0, this.pid);
      state.c_pointsMap.set(this.pid, this.point);
      state.c_geometryMap.set(this.geomId, geom);
    }
    drawCanvasFromState(state);
  }
}
