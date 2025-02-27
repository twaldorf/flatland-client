import * as THREE from "three";
import { state } from "../../State";
import { DistanceConstraint, Particle } from "../simulation/xpbdTypes";
import { LoopSubdivision } from 'three-subdivide';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import { generateTriPairIds } from "./mueller/stretchConstraints";

export const createPolygonPlane = (path:number[]) => {
  const points = path.map((index) => {
    return state.c_points[index].clone();
  })

  // Add the offset point in the beginning of the array
  const offsetPoint = points[0];
  points.reverse();
  points.push(offsetPoint);
  points.reverse();

  const iterations = 2;

  const params = {
      split:          true,       // optional, default: true
      uvSmooth:       false,      // optional, default: false
      preserveEdges:  false,      // optional, default: false
      flatOnly:       true,      // optional, default: false
      maxTriangles:   1024,   // optional, default: Infinity
  };

  const shape = new THREE.Shape( points );
  const geometry = new THREE.ShapeGeometry( shape );
  let subgeometry = LoopSubdivision.modify(geometry, iterations, params);
  subgeometry = BufferGeometryUtils.mergeVertices(subgeometry);
  const material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide, wireframe: true } );
  const mesh = new THREE.Mesh( subgeometry, material );
  mesh.scale.set( 0.01, 0.01, 0.01 );
  state.scene.add( mesh );

  // Array of floats, each position is three floats (x,y,z)
  const positions = subgeometry.getAttribute('position').array;

  // Position attribute, for position.setXYZ(i, x, y, z) updating
  const position = subgeometry.getAttribute('position') as THREE.BufferAttribute;

  // Array of integers making up triangles, each triangle is three ints
  const indices = subgeometry.getIndex().array as THREE.TypedArray;

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

  state.particles[0].velocity = new THREE.Vector3(-10, 10, 100);
  
  function generateDistanceConstraintBetweenPointIds(id0:number, id1:number) {
    const p1 = new THREE.Vector3(
      positions[id0 * 3], 
      positions[id0 * 3 + 1], 
      positions[id0 * 3 + 2]
    );
    
    const p2 = new THREE.Vector3(
      positions[id1 * 3], 
      positions[id1 * 3 + 1], 
      positions[id1 * 3 + 2]
    );
    
    const constraint1:DistanceConstraint = new DistanceConstraint(
      id0,
      id1,
      3,
      p1.distanceTo(p2),
      .1
    );
    
    state.constraints.push(constraint1);
    constraintPointIds.push([id0, id1]);
  }
  
  // List of paired points
  const constraintPointIds:number[][] = [];
  const { edgeIds } = generateTriPairIds(indices as Int8Array);

  for (let index = 0; index < edgeIds.length - 1; index++) {
    // build this into an adjacency matrix to reduce redundancy
    const i = edgeIds[index];
    const j = edgeIds[index + 1];
    const ids = [i, j];
    ids.sort((a, b) => a - b);

    // If the points do not already have a distance constraint
    if (constraintPointIds.find((pair) => pair[0] == ids[0] && pair[1] == ids[1]) === undefined && (i * 3 + 5) < indices.length - 1) {
      generateDistanceConstraintBetweenPointIds(ids[0], ids[1]);
    }

  }

  state.testObject = mesh;
  return mesh;
}