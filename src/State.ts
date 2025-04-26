import { Camera, Clock, Face, Group, Raycaster, Scene, Vector2 } from "three";
import { BufferBundle, BufferType, State } from "./types";
import { PathTool } from "./2D/tools/PathTool";
import { Command } from "./Command";

export const state:State = {
  version: '0.1',
  pointer: new Vector2,
  shiftDown: false,
  altDown: false,
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

  c_grainlines: new Map(),
  updateGrainlinePos (index:number, pos:Vector2) {
    const gl = this.c_grainlines.get(index);
    if (gl) {
      gl.position = pos;
      this.c_grainlines.set(index, gl);
    }
  },
  
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
  c_measure_path: [],
  c_measure_paths: [],
  c_measure_points: new Map(),
  cActive: false,
  cSelecting: false,
  pendingSelection: undefined as unknown as Command,
  cMovingPoint: false,
  c_move_from: new Vector2(),
  particles: [],
  constraints: [],

  c_zoomfactor: 1,

  pieces: new Map(),

  projectInfo: {
    title: 'untitled',
    author: 'unknown',
    lastUpdated: new Date(),
  },

  serialize():string {
    const {
      version,
      c_pointmap,
      c_points,
      c_paths,
      c_measure_paths,
      c_measure_points,
      c_shapes
    } = this;

    const coreInfo = {
      version,
      c_pointmap: Array.from(this.c_pointmap.entries()).map(([k, v]) => [k, [v.x, v.y]]),
      c_points: this.c_points.map(p => [p.x, p.y]),
      c_paths,
      c_measure_paths,
      c_measure_points: Array.from(this.c_measure_points.entries()).map(([k, v]) => [k, [v.x, v.y]]),
      c_shapes
    }

    const serializedObj = JSON.stringify(coreInfo);

    return serializedObj;
  },

  deserialize(stringObj:string):void {
    const serializedObj = JSON.parse(stringObj);
    if (serializedObj.version == this.version) {
      this.c_pointmap = new Map(serializedObj.c_pointmap.map(([k, [x, y]]) => [k, new Vector2(x, y)]));
      this.c_points = serializedObj.c_points.map(([x, y]) => new Vector2(x, y));
      this.c_paths = serializedObj.c_paths;
      this.c_measure_paths = serializedObj.c_measure_paths;
      this.c_measure_points = new Map(serializedObj.c_measure_points.map(([k, [x, y]]) => [k, new Vector2(x, y)]));
      this.c_shapes = serializedObj.c_shapes;
    }
  },

  clear():void {
    this.c_pointmap = new Map();
    this.c_points = [];
    this.c_paths = [];
    this.c_measure_paths = [];
    this.c_measure_points = new Map();
    this.c_shapes = [];
  }

};
