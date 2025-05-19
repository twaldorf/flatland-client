import { Clock, Face, Object3D, Vector2 } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PathTool, PathToolState } from "./2D/tools/PathTool";
import { Command } from "./Command";
import { SelectTool, SelectToolState } from "./2D/tools/SelectTool";
import { DistanceConstraint, Particle } from "./3D/simulation/xpbdTypes";
import { LineHit } from "./2D/geometry/lineIntersection";
import { MeasureTool, MeasureToolState } from "./2D/tools/MeasureTool";
import { GrainlineTool, GrainlineToolState } from "./2D/tools/GrainlineTool";
import { BezierPointEditorTool, BezierPointEditorToolState } from "./2D/tools/BezierPointEditorTool";

// State interface for global state singleton
export interface State {
  // Flag for enable/disable autosave
  autosave: boolean;
  // Test object for debugging
  testObject: unknown;

  // State schema version, increments by .01 with two decimal place precision
  version: number,

  // Project info like title, author, lastUpdated, etc
  projectInfo: ProjectInfo;

  // Collection of pieces
  pieces: Piece[];

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
  // Deprecated
  cMovingPoint: boolean;
  // from its previous position at:
  // Deprecated
  c_move_from: Vector2;

  // Making a selection (as opposed to creating a new mark)
  // Deprecated
  cSelecting: boolean;

  // Store the pending selection for execution on mouseUp
  // Deprecated
  pendingSelection: Command;

  // Map of active points
  // Deprecated
  // Pairs an index in the point array with a vector2 for convenience
  // These points are all 'active', i.e. they have not been deleted and contribute to shapes or paths
  // These points are not necessarily selected
  c_pointmap: Map<number, Vector2>;

  // New pointmap to account for Beziers
  c_pointsMap: Map<string, Point>;
  addGeometryPoint: (v: Vector2 | BezierPoint) => string;

  // Map of all geometries
  c_geometryMap: Map<string, Geometry2D>,

  // 2D Array of all paths composed by the indices of each path member vertices
  // DEPRECATED
  c_paths: Array<Array<number>>;

  // All selected points on the canvas
  c_selectedPoints: Array<string>;

  // All selected shapes on the canvas
  // Indices of elements in c_shapes
  c_selected_shapes: Array<number>;

  // Array of LineHits, lines that are currently selected
  c_selected_lines: Array<LineHit>;

  // Array of selected Geometries (via ID strings0for use in rendering and collection
  c_selectedGeometries: Array<string>;

  // Array of closed paths (shapes)
  // Shapes are moved from the paths array into the shapes array
  // DEPRECATED
  // c_shapes: Array<Array<number>>;

  // Index of the active path within the c_paths array
  // -1 when it is inactive
  // DEPRECATED
  c_activePath: number;

  // Array of point indices making up a measuring line
  // Deprecated  but in use
  c_measure_path: number[];

  // Array of arrays of measure point ids
  c_measure_paths: string[][];

  // Map of all points used in measurement
  c_measure_points: Map<string, Vector2>;

  // Map of all grainlines to their associated shapeArray indices
  c_grainlines: Map<number, Grainline>;
  // Setter for grainline positions (shape centroids often change)
  updateGrainlinePos: (index:number, pos:Vector2) => void;

  // Scale factor manipulated by the user through zoom functionality
  c_zoomfactor: number;

  // XPBD & Simulations
  constraints: DistanceConstraint[];
  particles: Particle[];

  // Load, save functionality
  serialize(): string;
  deserialize(s:string): Partial<State>;
  clear(): void;

}

export interface Geometry2D {
  type: string,
  id: string,
  pointIds: string[],
}

export type Point = BezierPoint | Vector2;

type Mode = 'default' | 
            'group-select';

export interface BufferBundle {
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
  pos: Vector2;
}

export type BufferType = "preview" | "points" | "paths" | "shapes" | "grid" | "cursor_preview" | "shape_preview" | string;
// The inclusion of string in BufferType allows for thumbnail buffers. If this causes trouble, simply split the thumbnail buffers into their own c_buffer_canvases map or something and narrow this type.

export interface ToolBase {
  name: string;
  initializeEvents: Function;
  dismountEvents: Function;
  applyState: (state:ToolBase['state']) => void;
  readonly state: PathToolState | SelectToolState | MeasureToolState | GrainlineToolState | BezierPointEditorToolState;
}

export interface ProjectInfo {
  title: string;
  author: string;
  lastUpdated: Date;
}

export interface ProjectSummary {
  info: ProjectInfo;
  pieces: Piece[];
  thumbnail: HTMLCanvasElement;
}

export type Tool = PathTool | SelectTool | MeasureTool | GrainlineTool | BezierPointEditorTool;
export type ToolName = "path" | "select" | "measure" | "grainline" | "bezier point editor";

export type DrawableEntity = Vector2 | Vector2[];

export interface Grainline {
  // Angle between 0 and 2PI in radians, from noon as 0
  angle: number;

  // Must be the centroid of the shape
  position: Vector2;
}

export interface Piece {
  id: string; // Hidden
  geometryId: string; // Hidden
  name: string; // Shown
  thumb?: HTMLCanvasElement; // Shown
  canvas?: OffscreenCanvas; // Hidden
  angle?: number; // Shown as Set or Unset, not the number
  description?: string; // Shown as a preview
  quantity?:number; // Shown
  seamAllowanceGeometryId?: string; // Hidden
  uiColor: "#134ecc"; // hidden
  interfaced: 0; // hidden
  area?: number; // Shown only if present
}

interface RawPointer {
  rx: number,
  ry: number,
}

interface Controls {
  waitForDoubleClick: boolean;
  doubleClick: boolean;
}

export interface BezierPoint {
  from: Vector2;
  to: Vector2;
  c1: Vector2;
  c2: Vector2;
}
