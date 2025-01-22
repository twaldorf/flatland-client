import { Face, Intersection, Mesh, Object3D } from "three";
import { Command } from "../Command";
import { material_selected } from "../Materials";
import { state } from "../State";

export interface FaceSelectionBundle {
  faceIndex:number,
  face:Face,
  object:Mesh,
}

interface FaceIdSelectionBundle {
  faceIndex:number,
  face:FaceId,
  object:Mesh,
}

export interface FaceId {
  face:Face,
  uuid:string,
}

export const tagFace = (face:Face, uuid:string):FaceId => {
  const generic_face = { ...face, materialIndex: 0 };
  return { face: generic_face, uuid };
}

export class SelectFaceCommand implements Command {
  private __selected:Set<string>;
  private __bundle:FaceIdSelectionBundle
  
  constructor(bundle:FaceSelectionBundle) {
    this.__selected = state.selected_faces;
    this.__bundle = {...bundle, face: tagFace(bundle.face, bundle.object.uuid)};
  }

  do() {
    if (!this.__selected.has(JSON.stringify(this.__bundle.face))) {
      state.selected_faces.add(JSON.stringify(this.__bundle.face));
      this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 1;
    }
  }

  undo() {
    state.selected_faces = this.__selected;
    this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 0;
  }
}

export class DeselectFaceCommand implements Command {
  private __bundle:FaceIdSelectionBundle;

  constructor(bundle:FaceSelectionBundle) {
    this.__bundle = {...bundle, face: tagFace(bundle.face, bundle.object.uuid)};
  }

  do() {
    if (state.selected_faces.has(JSON.stringify(this.__bundle.face))) {
      state.selected_faces.delete(JSON.stringify(this.__bundle.face));
      this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 0;
    }
  }

  undo() {
    state.selected_faces.add(JSON.stringify(this.__bundle.face));
    this.__bundle.object.geometry.groups[Math.floor(this.__bundle.faceIndex / 2)].materialIndex = 1;
  }
  
}