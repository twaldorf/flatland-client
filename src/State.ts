import { Camera, Clock, Face, Group, Raycaster, Scene, Vector2 } from "three";
import { BezierPoint, BufferBundle, BufferType, State } from "./types";
import { PathTool } from "./2D/tools/PathTool";
import { Command } from "./Command";
import { generateUUID } from "three/src/math/MathUtils";
import { flattenGeometryMap, flattenPiecesMap, flattenPointsMap, restoreGeometryMap, restorePiecesMap, restorePointsMap } from "./utils/saveutils";
import { SelectTool } from "./2D/tools/SelectTool";
import { BASE_PROJECT_TITLE } from "./constants";

export function genPointId() {
  return generateUUID();
}
export function genGeoId() {
  return generateUUID();
}

export const state:State = {
  version: 0.13,
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
  autosave: true,
  
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
  tool: new SelectTool(),
  c_points: [],
  c_pointmap: new Map(),

  c_pointsMap: new Map(),
  c_geometryMap: new Map(),
  geometryMap: new Map(),

  c_paths: [],
  c_selectedPoints: [],
  c_shapes: [],
  c_selected_shapes: [],
  c_selected_lines: [],
  c_selectedGeometries: [],
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
    title: BASE_PROJECT_TITLE,
    author: '',
    lastUpdated: new Date(),
  },

  addGeometryPoint(v:Vector2 | BezierPoint) {
    const id = genPointId();
    this.c_pointsMap.set(id, v);
    return id;
  },

  serialize():string {
    const {
      version,
      c_pointsMap,
      c_geometryMap,
      projectInfo,
      pieces,
    } = this;

    // flattened version of geometries, pieces, etc
    const coreInfo = {
      version,
      c_pointsMap: flattenPointsMap(c_pointsMap),
      c_geometryMap: flattenGeometryMap(c_geometryMap),
      projectInfo,
      pieces: flattenPiecesMap(pieces),
    }

    const serializedObj = JSON.stringify(coreInfo);

    return serializedObj;
  },

  deserialize(stringObj:string):Partial<State> {
    const serializedObj = JSON.parse(stringObj);

    const contents:Partial<State> = {};

    if (serializedObj.version == this.version) {
      contents.c_pointsMap = restorePointsMap(serializedObj.c_pointsMap);
      contents.c_geometryMap = restoreGeometryMap(serializedObj.c_geometryMap);
      contents.projectInfo = serializedObj.projectInfo;
      contents.pieces = restorePiecesMap(serializedObj.pieces);
    }

    return contents;
  },

  clear():void {
    console.log('clear');
    this.c_pointsMap = new Map();
    this.c_geometryMap = new Map();
    this.pieces = new Map();
    this.projectInfo = {
      title: BASE_PROJECT_TITLE,
      author: '',
      lastUpdated: new Date()
    };
  }

};
