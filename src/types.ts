export interface State {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  pointer: THREE.Vector2;
  raycaster: THREE.Raycaster;
  selected: Quads;

  context: CanvasRenderingContext2D | null;

  pattern: Pattern;
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