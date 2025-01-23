import { Camera, Face, Group, Raycaster, Scene, Vector2 } from "three";
import { Pattern, State } from "./types";

export const state:State = {
  canvas: undefined,
  scene: new Scene,
  camera: new Camera,
  camera_group: new Group,
  renderer: undefined,
  pointer: new Vector2,
  raycaster: new Raycaster,
  selected: new Set,
  selected_faces: new Set,
  pointerDown: false,
  context: null,
  // pattern: undefined,
  intersects: null,
  rawPointer: {rx:0, ry:0},
  objects: [],
  mode: 'default',
  controls: {
    waitForDoubleClick: false,
    doubleClick: false,
  },
};
