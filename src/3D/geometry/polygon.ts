import * as THREE from "three";
import { state } from "../../State";

export const createPolygonPlane = (path:number[]) => {
  const points = path.map((index) => {
    return state.c_points[index].clone().divideScalar(100);
  })
  const shape = new THREE.Shape( points );
  const geometry = new THREE.ShapeGeometry( shape );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  state.scene.add( mesh );
  return mesh;
}