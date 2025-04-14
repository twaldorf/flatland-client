import { Clock, Face, Object3D, Vector2 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PathTool, PathToolState } from "./2D/tools/PathTool";
import { Command } from "./Command";
import { SelectTool, SelectToolState } from "./2D/tools/SelectTool";
import { DistanceConstraint, Particle } from "./3D/simulation/xpbdTypes";
import { ToolState } from "./2D/tools/changeTool";
import { LineHit } from "./2D/geometry/lineIntersection";
import { MeasureTool, MeasureToolState } from "./2D/tools/MeasureTool";

// State interface for global state singleton
export interface State {
  // Test object for debugging
  testObject: unknown;

  // State schema version
  version: string,

  // Project info like title, author, lastUpdated, etc
  projectInfo: ProjectInfo;

  // ## State shared between editor and canvas
  pointerDown: boolean;
  pointer: THREE.Vector2;
  shiftDown: boolean;
  altDown: boolean;

  // ## Editor state properties, not prepended
  scene: THREE.Scene;
  camera: THREE.Camera;
  camera_group: THREE.Group;
  camera_controls: OrbitControls;
  renderer: THREE.Renderer;
  raycaster: THREE.Raycaster;
  selected: Set<Object3D>;
  selected_faces: Set<string>;
  context: CanvasRenderingContext2D;
  intersects: THREE.Intersection[] | null;
  rawPointer: RawPointer;
  objects: THREE.Object3D[];
  mode: Mode;
  controls: Controls;
  clock: Clock;

  // ## Canvas state properties, prepended with c
  canvas: HTMLCanvasElement;

  // Preview buffer for tool effect previews
  c_preview_context: CanvasRenderingContext2D;
  c_preview_canvas: HTMLCanvasElement;

  c_buffers: Map<BufferType, BufferBundle>;

  // Canvas is current active object, defined by mouse loc
  cActive: boolean;

  // Current canvas tool
  tool: Tool;

  // A selected point is being moved
  cMovingPoint: boolean;
  // from its previous position at:
  c_move_from: Vector2;

  // Making a selection (as opposed to creating a new mark)
  // TODO: deprecated
  cSelecting: boolean;

  // Store the pending selection for execution on mouseUp
  // TODO: deprecated ?
  pendingSelection: Command;

  // All points on the canvas
  c_points: Array<Vector2>;

  // Map of active points
  // Pairs an index in the point array with a vector2 for convenience
  // These points are all 'active', i.e. they have not been deleted and contribute to shapes or paths
  // These points are not necessarily selected
  c_pointmap: Map<number, Vector2>;

  // 2D Array of all paths composed by the indices of each path member vertices
  c_paths: Array<Array<number>>;

  // All selected points on the canvas
  c_selected: Array<number>;

  // All selected shapes on the canvas
  // Indices of elements in c_shapes
  c_selected_shapes: Array<number>;

  // Array of LineHits, lines that are currently selected
  c_selected_lines: Array<LineHit>;

  // Array of closed paths (shapes)
  // Shapes are moved from the paths array into the shapes array
  c_shapes: Array<Array<number>>;

  // Index of the active path within the c_paths array
  // -1 when it is inactive
  c_activePath: number;

  // Array of point indices making up a measuring line
  c_measure_path: number[];

  // Array of arrays of measure point ids
  c_measure_paths: string[][];

  // Map of all points used in measurement
  c_measure_points: Map<string, Vector2>;

  // Scale factor manipulated by the user through zoom functionality
  c_zoomfactor: number;

  // XPBD & Simulations
  constraints: DistanceConstraint[];
  particles: Particle[];

  // Load, save functionality
  serialize(): string;
  deserialize(s:string): void;
  clear(): void;

}

type Mode = 'default' | 
            'group-select';

export interface BufferBundle {
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
}

export type BufferType = "preview" | "points" | "paths" | "shapes" | "grid" | "cursor_preview" | "shape_preview" | string;
// The inclusion of string in BufferType allows for thumbnail buffers. If this causes trouble, simply split the thumbnail buffers into their own c_buffer_canvases map or something and narrow this type.

export interface ToolBase {
  name: string;
  initializeEvents: Function;
  dismountEvents: Function;
  readonly state: PathToolState | SelectToolState | MeasureToolState;
}

export interface ProjectInfo {
  title: string;
  author: string;
  lastUpdated: Date;
}

export type Tool = PathTool | SelectTool | MeasureTool;
export type ToolName = "path" | "select" | "measure";

export type DrawableEntity = Vector2 | Vector2[];

export interface Piece {
  id: string;
  shapeIndex: number;
  name: string;
  thumb: HTMLCanvasElement;
  canvas: OffscreenCanvas;
  // name is also the key to thhe thumbnail map
  // area: number;
}

interface RawPointer {
  rx: number,
  ry: number,
}

interface Controls {
  waitForDoubleClick: boolean;
  doubleClick: boolean;
}
