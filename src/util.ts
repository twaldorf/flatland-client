import { Face, Intersection, Mesh, Object3D } from "three";
import { State } from "./types";
import { FaceSelectionBundle } from "./commands/SelectFaceCommand";

// This file and all its logic is very stale and will be overrun as soon as significant work is done on the geometry side

export const mouseOverCanvas = (state:State):boolean => {
  const bounds = state.renderer.domElement.getBoundingClientRect();
  if (state.rawPointer) {
    return state.rawPointer.rx >= bounds.left && state.rawPointer.rx <= bounds.right && state.rawPointer.ry >= bounds.top && state.rawPointer.ry <= bounds.bottom;
  }
  return false;
}

export const intersecting = (state:State):boolean => {
  return state.intersects != null && state.intersects.length > 0;
}

export const first_intersecting_object = (state:State):Object3D | undefined => {
  const selected_mesh = state.intersects.filter((obj:Intersection<Object3D>): boolean => {
    // Select only Mesh objects (for now)
    if (obj.object.type == "Mesh") {
      return true;
    }
    return false;
  })[0];
  if (selected_mesh) {
    return selected_mesh.object;
  } else {
    return undefined;
  }
}

export const first_intersecting_face = (state:State):FaceSelectionBundle | null | undefined => {
  const selected_mesh = state.intersects.filter((obj:Intersection<Object3D>): boolean => {
    // Select only Mesh objects (for now)
    if (obj.object.type == "Mesh") {
      return true;
    }
    return false;
  })[0];
  if (selected_mesh) {
    return { faceIndex: selected_mesh.faceIndex, face: selected_mesh.face, object: selected_mesh.object };
  } else {
    return undefined;
  }
}