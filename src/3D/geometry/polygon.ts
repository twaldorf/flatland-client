import * as THREE from "three";
import { state } from "../../State";
import { DistanceConstraint, Particle } from "../simulation/protoXPBD";

export const createPolygonPlane = (path:number[]) => {
  const points = path.map((index) => {
    return state.c_points[index].clone().divideScalar(100);
  })
  const shape = new THREE.Shape( points );
  const geometry = new THREE.ShapeGeometry( shape );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const mesh = new THREE.Mesh( geometry, material );
  state.scene.add( mesh );
  const indices = geometry.index;
  // state.sim_array = points.map((point):Particle => {
  //   return { 
  //     position: new THREE.Vector3(point.x, point.y, 0),
  //     invMass: 0,
  //     previousPosition: new THREE.Vector3(point.x, point.y, 0),
  //     predicted: new THREE.Vector3(point.x, point.y, 0),
  //     velocity: new THREE.Vector3(0, 0, 0)
  //   }
  // });
  // let constraints_array = [];
  // for (let i = 0; i < points.length ; ++i) {
  //    const constraint = new DistanceConstraint(
  //     state.sim_array[indices[i]],
  //     state.sim_array[indices[ (i + 1) % points.length] ],
  //     state.sim_array[i].position.distanceTo(state.sim_array[ (i + 1) % points.length]) / 100,
  //     .1);
  //     constraints_array.push(constraint);
  // }
  // state.constraints = constraints_array;
  return mesh;
}