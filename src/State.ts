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


// class State {
//   canvas: HTMLCanvasElement;
//   scene: THREE.Scene;
//   camera: THREE.Camera;
//   camera_group: THREE.Group;
//   renderer: THREE.Renderer;
//   pointer: THREE.Vector2;
//   raycaster: THREE.Raycaster;
//   selected: Array<THREE.Object3D>;
//   pointerDown: Boolean;
//   context: CanvasRenderingContext2D | null;
//   pattern: Pattern;
//   intersects: THREE.Intersection[] | null;
//   rawPointer: ;
//   objects: THREE.Object3D[];
//   constructor() {
//   }
//   update(key:string, newState:State[keyof State]) {
//     this[key] = newState;
//   }
//   updateRawPointer(value:)
//   get(key:string):State[keyof State] | null {
//     return this[key];
//   }
// }

// export const state = new State();
