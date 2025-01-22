import { Intersection, Mesh, Object3D } from "three";
import { pushCommand } from "../Command";
import { SelectObjectCommand, DeselectObjectCommand } from "../commands/SelectObjectCommand";
import { state } from "../State";
import { first_intersecting_face, first_intersecting_object, intersecting } from "../util";
import { DeselectFaceCommand, SelectFaceCommand, tagFace } from "../commands/SelectFaceCommand";

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
  state.rawPointer.rx = event.clientX;
  state.rawPointer.ry = event.clientY;

  state.pointer.x = 2 * (window.innerWidth / state.renderer.domElement.offsetWidth) * 
  ( event.clientX - state.renderer.domElement.getBoundingClientRect().x ) 
  / ( window.innerWidth ) - 1;

	state.pointer.y = -2 * (window.innerHeight / state.renderer.domElement.offsetHeight) * 
  ( event.clientY - state.renderer.domElement.getBoundingClientRect().y ) 
  / ( window.innerHeight ) + 1;
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
      // pushCommand(new SelectObjectCommand(selected_mesh));
    }
  } else {
    pushCommand(new DeselectObjectCommand());
  }
}

export function onPointerUp( event ) {
  state.pointerDown = false;
}