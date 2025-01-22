import { Face, Intersection, Mesh, Object3D } from "three";
import { Command } from "../Command";
import { material_selected } from "../Materials";
import { state } from "../State";

export interface FaceSelectionBundle {
  faceIndex:number,
  face:Face,
  object:Mesh,
}

export class SelectFaceCommand implements Command {
  private __selected:Set<THREE.Face>;
  private __bundle:FaceSelectionBundle
  
  constructor(bundle:FaceSelectionBundle) {
    this.__selected = state.selected_faces;
    this.__bundle = bundle;
  }

  do() {
    if (!this.__selected.has(this.__bundle.face)) {
      state.selected_faces.add(this.__bundle.face);
      this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 1;
      console.log(state.objects)
    }
  }

  undo() {
    state.selected_faces = this.__selected;
    this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 0;
  }
}

export class DeselectFaceCommand implements Command {
  private __selected:Set<THREE.Face>;
  private __bundle:FaceSelectionBundle;

  constructor(face) {
    this.__selected = state.selected_faces;
    this.__bundle.face = face;
  }
  do() {
    if (state.selected_faces.has(this.__bundle.face)) {
      state.selected_faces.delete(this.__bundle.face);
      this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 0;
    }
  }
  undo() {
    state.selected_faces.add(this.__bundle.face);
    this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 1;
  }
  
}