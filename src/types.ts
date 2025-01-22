import { Face, Object3D } from "three";

export interface State {
  canvas: HTMLCanvasElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  camera_group: THREE.Group;
  renderer: THREE.Renderer;
  pointer: THREE.Vector2;
  raycaster: THREE.Raycaster;
  selected: Set<Object3D>;
  selected_faces: Set<Face>;
  pointerDown: Boolean;
  context: CanvasRenderingContext2D | null;
  pattern: Pattern;
  intersects: THREE.Intersection[] | null;
  rawPointer: RawPointer;
  objects: THREE.Object3D[];
  mode: Mode;
  controls: Controls;
  // mesh: THREE.Mesh;
  // line: THREE.Line;
}

type Mode = 'default' | 
            'group-select';

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