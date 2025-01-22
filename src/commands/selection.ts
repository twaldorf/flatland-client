import { Intersection, Object3D } from "three";
import { Command } from "../Command";
import { material_selected } from "../Materials";
import { state } from "../State";

export class SelectObjectCommand implements Command {
  private __selected:Set<THREE.Object3D>;
  private __object:THREE.Object3D;
  prev_material:THREE.MeshBasicMaterial;
  
  constructor(object:THREE.Object3D) {
    this.__selected = state.selected;
    this.__object = object;
  }

  do() {
    if (!state.selected.has(this.__object)) {
      state.selected = new Set([this.__object]);
      this.__object.original_material = this.__object.material;
      this.__object.material = material_selected;
    }
  }

  undo() {
    state.selected = this.__selected;
    this.__object.material = prev_material;
  }
}

export class DeselectObjectCommand implements Command {
  __selected:Set<THREE.Object3D>
  constructor() {
    this.__selected = state.selected;
  }
  do() {
    if (state.selected.size > 0) {
      state.selected.forEach((obj:Object3D):void => {
        obj.material = obj.original_material;
      })
      state.selected = new Set();
    }
  }
  undo() {
    state.selected = this.__selected;
  }
  
}