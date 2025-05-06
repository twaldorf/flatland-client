import { Vector2 } from "three";
import { state } from "../../State";
import { drawCanvasFromState } from "../rendering/canvas";
import { selectionRadius } from "../settings/interface";
import { Point } from "../../types";

// Protected, only to be used by Command
export function selectPoint(index: number) {
  if (!state.c_selected.includes(index)) {
    state.c_selected.push(index);
    console.log(state.c_selected)
  }
}

// Protected, only to be used by Command
export function deselect() {
  state.c_selected = [];
  drawCanvasFromState(state);
}

// Protected, only to be used by Command
export function removePointFromSelection( v: Vector2 ) {
  const i = state.c_selected.findIndex(( index ) => v.equals(state.c_points[ index ]));
  state.c_selected.splice( i, 1 );
}

export function getPointByIndex(index:number):Vector2 {
  return state.c_points[ index ];
}

export function __indexIsNotSelected(index:number):boolean {
  const result = state.c_selected.findIndex((i) => { return i == index });
  return result === -1;
}

export function checkPointOverlap(v:Vector2):string | undefined {
  state.c_pointsMap.forEach((point:Point, id: string) => {
    if (state.c_points[i].distanceTo(v) < selectionRadius) {
      return i;
    }

  })
  return undefined;
}

export function checkPathOverlap(v:Vector2): boolean {
  return true;
}