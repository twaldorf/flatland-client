export interface State {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
  pointer: THREE.Vector2;
  raycaster: THREE.Raycaster;
}

export interface Quads {
  // these are indices for tris in the geometry array
  geometry: THREE.BufferGeometry;
  n_vertices: number;
}

