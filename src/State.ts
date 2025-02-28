import { Camera, Clock, Face, Group, Raycaster, Scene, Vector2 } from "three";
import { BufferBundle, BufferType, BufferTypes, State } from "./types";
import { PathTool } from "./2D/tools/PathTool";
import { Command } from "./Command";
import { DistanceConstraint } from "./3D/simulation/xpbdTypes";

export const state:State = {
  pointer: new Vector2,
  shiftDown: false,
  pointerDown: false,
  
  scene: new Scene,
  camera: new Camera,
  camera_group: new Group,
  camera_controls: undefined,
  renderer: undefined,
  
  raycaster: new Raycaster,
  selected: new Set,
  selected_faces: new Set,
  // pattern: undefined,
  intersects: null,
  rawPointer: {rx:0, ry:0},
  
  objects: [],
  testObject: null,
  
  mode: 'default',
  
  controls: {
    waitForDoubleClick: false,
    doubleClick: false,
  },
  
  clock: new Clock(true),
  
  context: null,
  c_preview_context: null,
  c_preview_canvas: null,
  c_buffers: new Map<BufferType, BufferBundle>,
  canvas: undefined,
  tool: new PathTool(),
  c_points: [],
  c_pointmap: new Map(),
  c_paths: [],
  c_selected: [],
  c_shapes: [],
  c_selected_shapes: [],
  c_selected_lines: [],
  cActive: false,
  cSelecting: false,
  pendingSelection: undefined as unknown as Command,
  cMovingPoint: false,
  c_move_from: undefined,
  particles: [],
  constraints: [],

  c_zoomfactor: 1,
};
