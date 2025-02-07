import { Camera, Face, Group, Raycaster, Scene, Vector2 } from "three";
import { State } from "./types";
import { PathTool } from "./2D/tools/PathTool";
import { Command } from "./Command";

export const state:State = {
  pointer: new Vector2,
  shiftDown: false,
  
  scene: new Scene,
  camera: new Camera,
  camera_group: new Group,
  renderer: undefined,
  
  raycaster: new Raycaster,
  selected: new Set,
  selected_faces: new Set,
  // pattern: undefined,
  intersects: null,
  rawPointer: {rx:0, ry:0},
  
  objects: [],
  
  mode: 'default',
  
  controls: {
    waitForDoubleClick: false,
    doubleClick: false,
  },
  
  context: null,
  canvas: undefined,
  pointerDown: false,
  tool: new PathTool(),
  c_points: [],
  c_paths: [],
  c_selected: [],
  c_shapes: [],
  c_selected_shapes: [],
  cActive: false,
  cSelecting: false,
  pendingSelection: undefined as unknown as Command,
  cMovingPoint: false,
  c_move_from: undefined,
};
