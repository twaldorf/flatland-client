import { Face, Object3D, Vector2 } from "three";
import { PathTool } from "./2D/tools/PathTool";
import { Command } from "./Command";
import { SelectTool } from "./2D/tools/SelectTool";

// State interface for global state singleton
export interface State {
  // ## State shared between editor and canvas
  pattern: Pattern;
  pointerDown: boolean;
  pointer: THREE.Vector2;
  shiftDown: boolean;

  // ## Editor state properties, not prepended
  scene: THREE.Scene;
  camera: THREE.Camera;
  camera_group: THREE.Group;
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
  pendingSelection: Command;

  // All points on the canvas
  c_points: Array<Vector2>;

  // Map of active points
  c_pointmap: Map<number, Vector2>;

  // 2D Array of all paths composed by the indices of each path member vertices
  c_paths: Array<Array<number>>;

  // All selected points on the canvas
  c_selected: Array<number>;

  // All selected shapes on the canvas
  // Indices of elements in c_shapes
  c_selected_shapes: Array<number>;

  // Array of closed paths (shapes)
  // Shapes are moved from the paths array into the shapes array
  c_shapes: Array<Array<number>>;

  // Index of the active path within the c_paths array
  // -1 when it is inactive
  c_activePath: number;

  // Scale factor manipulated by the user through zoom functionality
  c_zoomfactor: number;
}

type Mode = 'default' | 
            'group-select';

export interface BufferBundle {
  canvas: OffscreenCanvas;
  context: OffscreenCanvasRenderingContext2D;
}

export type BufferType = "preview" | "points" | "lines" | "shapes" ;

export interface ToolBase {
  name: string;
  initializeEvents: Function;
  dismountEvents: Function;
}

export type Tool = PathTool | SelectTool;
export type ToolName = "path" | "select";

export type DrawableEntity = Vector2 | Vector2[];

interface RawPointer {
  rx: number,
  ry: number,
}

interface Controls {
  waitForDoubleClick: boolean;
  doubleClick: boolean;
}

export interface Pattern {
  pieces: Array<Node>;
  seams: Array<number>;
}

export interface Quads {
  // these are indices for tris in the geometry array
  geometry: THREE.BufferGeometry;
  n_vertices: number;
}

export interface Node {
  // TODO: Replace quads with polygons
  quads: Array<Quads>;
  vertices: Array<THREE.Vector3>;
  // contains index pairs for vertices array, a pair makes an edge
  edges: Array<number>;
}