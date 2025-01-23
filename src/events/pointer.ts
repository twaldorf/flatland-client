import { Intersection, Mesh, Object3D } from "three";
import { pushCommand } from "../Command";
import { SelectObjectCommand, DeselectObjectCommand } from "../commands/SelectObjectCommand";
import { state } from "../State";
import { first_intersecting_face, first_intersecting_object, intersecting, localizePointer } from "../util";
import { DeselectFaceCommand, SelectFaceCommand, tagFace } from "../commands/SelectFaceCommand";
import { State } from "../types";

export function onDoubleClick(event: MouseEvent) {
  state.intersects = [];
  state.raycaster.setFromCamera( state.pointer, state.camera );
  const intersects = state.raycaster.intersectObjects( state.objects );
  state.intersects = intersects;

  if (intersecting(state)) {
   const bundle = first_intersecting_face(state);
   if (bundle && bundle.faceIndex) {
    if (!state.selected_faces.has(JSON.stringify(tagFace(bundle.face, bundle.object.uuid)))) {
      pushCommand(new SelectFaceCommand(bundle));
    } else {
      pushCommand(new DeselectFaceCommand(bundle));
    }
   }
  } 
}

// localize pointer position

export function onPointerMove( event: MouseEvent ) {
  localizePointer(event, state)
  if (state.pointerDown && state.selected_faces.size > 0) {
    
  }

}

// click to add points
export function onPointerDown( event ) {
  state.pointerDown = true;

  state.intersects = [];
  state.raycaster.setFromCamera( state.pointer, state.camera );
  const intersects = state.raycaster.intersectObjects( state.objects );
  state.intersects = intersects;

  // TODO: Track dragging and account for camera movement clicks
  if (intersecting(state)) {
    const selected_mesh = first_intersecting_object(state);
    if (selected_mesh) {
      pushCommand(new SelectObjectCommand(selected_mesh));
    }
  } else {
    pushCommand(new DeselectObjectCommand());
  }
}

export function onPointerUp( event ) {
  state.pointerDown = false;
}