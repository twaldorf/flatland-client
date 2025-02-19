import * as THREE from "three";
import { state } from "../../State";
import { DistanceConstraint, Particle } from "../simulation/xpbdTypes";
import { LoopSubdivision } from 'three-subdivide';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

export const createPolygonPlane = (path:number[]) => {
  const points = path.map((index) => {
    return state.c_points[index].clone();
  })

  // Add the offset point in the beginning of the array
  const offsetPoint = points[0];
  points.reverse();
  points.push(offsetPoint);
  points.reverse();

  const iterations = 1;

  const params = {
      split:          true,       // optional, default: true
      uvSmooth:       false,      // optional, default: false
      preserveEdges:  false,      // optional, default: false
      flatOnly:       true,      // optional, default: false
      maxTriangles:   250,   // optional, default: Infinity
  };

  const shape = new THREE.Shape( points );
  const geometry = new THREE.ShapeGeometry( shape );
  let subgeometry = LoopSubdivision.modify(geometry, iterations, params);
  subgeometry = BufferGeometryUtils.mergeVertices(subgeometry);
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
  const mesh = new THREE.Mesh( subgeometry, material );
  mesh.scale.set( 0.01, 0.01, 0.01 );
  state.scene.add( mesh );

  // Array of floats, each position is three floats (x,y,z)
  const positions = subgeometry.getAttribute('position').array;

  // Position attribute, for position.setXYZ(i, x, y, z) updating
  const position = subgeometry.getAttribute('position') as THREE.BufferAttribute;

  // Array of integers making up triangles, each triangle is three ints
  // const indices = subgeometry.getIndex().array as THREE.TypedArray;

  // Remove offset element from points array
  points.reverse();
  points.pop();
  points.reverse();

  // Generate particles from real points
  for (let i = 0; i < positions.length / 3; ++i) {
    let point = { x: positions[(i * 3)], y: positions[(i * 3 + 1)], z: positions[(i * 3 + 2)]};
    const particle = {
      position: new THREE.Vector3(point.x, point.y, 0),
      positionArray: position,
      positionIndex: i,
      invMass: .1,
      previousPosition: new THREE.Vector3(0,0,0),
      predicted: new THREE.Vector3(0,0,0),
      velocity: new THREE.Vector3(0, 0, 0),
      geometry: subgeometry,
    }
    state.particles.push(particle);
  };

  // state.particles[0].velocity = new THREE.Vector3(-100, 10000000, 1000);


  // Generate constraints from points
  for (let i = 0; i < (positions.length - 3) / 3; ++i) {

    const pointPosition = new THREE.Vector3(
      positions[i * 3], 
      positions[i * 3 + 1], 
      positions[i * 3 + 2]
    );

    const nextPointPosition = new THREE.Vector3(
      positions[( i + 1 ) * 3], 
      positions[( i + 1 ) * 3 + 1], 
      positions[( i + 1 ) * 3 + 2]
    );

    const constraint:DistanceConstraint = new DistanceConstraint(
      i,
      i + 1,
      3,
      pointPosition.distanceTo(nextPointPosition),
      .1
    );

    state.constraints.push(constraint);
  }

  state.testObject = mesh;
  return mesh;
}