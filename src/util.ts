import { Face, Intersection, Mesh, Object3D } from "three";
import { State } from "./types";
import { FaceSelectionBundle } from "./commands/SelectFaceCommand";

export const mouseOverCanvas = (state:State):boolean => {
  const bounds = state.renderer.domElement.getBoundingClientRect();
  if (state.rawPointer) {
    return state.rawPointer.rx >= bounds.left && state.rawPointer.rx <= bounds.right && state.rawPointer.ry >= bounds.top && state.rawPointer.ry <= bounds.bottom;
  }
  return false;
}

export const localizePointer = (event:MouseEvent, state:State):void => {
  state.rawPointer.rx = event.clientX;
  state.rawPointer.ry = event.clientY;

  state.pointer.x = 2 * (window.innerWidth / state.renderer.domElement.offsetWidth) * 
  ( event.clientX - state.renderer.domElement.getBoundingClientRect().x ) 
  / ( window.innerWidth ) - 1;

  state.pointer.y = -2 * (window.innerHeight / state.renderer.domElement.offsetHeight) * 
  ( event.clientY - state.renderer.domElement.getBoundingClientRect().y ) 
  / ( window.innerHeight ) + 1;
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