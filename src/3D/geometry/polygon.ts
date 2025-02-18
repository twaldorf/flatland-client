import * as THREE from "three";
import { state } from "../../State";
import { DistanceConstraint, Particle } from "../simulation/xpbdTypes";

export const createPolygonPlane = (path:number[]) => {
  const points = path.map((index) => {
    return state.c_points[index].clone();
  })

  // Add the offset point in the beginning of the array
  const offsetPoint = points[0];
  points.reverse();
  points.push(offsetPoint);
  points.reverse();
  console.log(points)

  const shape = new THREE.Shape( points );
  const geometry = new THREE.ShapeGeometry( shape );
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00, side: THREE.DoubleSide } );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.scale.set(0.01, 0.01, 0.01);
  state.scene.add( mesh );

  // Array of floats, each position is three floats (x,y,z)
  const positions = geometry.getAttribute('position').array;

  // Position attribute, for position.setXYZ(i, x, y, z) updating
  const position = geometry.getAttribute('position') as THREE.BufferAttribute;

  // Array of integers making up triangles, each triangle is three ints
  const indices = geometry.getIndex().array as THREE.TypedArray;

  // Remove offset element from points array
  points.reverse();
  points.pop();
  points.reverse();

  // Generate particles from real points
  for (let i = 0; i < points.length; ++i) {
    let point = { x: positions[(i * 3)], y: positions[(i * 3 + 1)], z: positions[(i * 3 + 2)]};
    const particle = {
      position: new THREE.Vector3(point.x, point.y, 0),
      positionArray: position,
      positionIndex: i,
      invMass: .1,
      previousPosition: new THREE.Vector3(0,0,0),
      predicted: new THREE.Vector3(0,0,0),
      velocity: new THREE.Vector3(0, 0, 0),
      geometry: geometry,
    }
    state.particles.push(particle);
  };


  // Generate constraints from points
  const constraints_array = [];
  for (let i = 0; i < points.length ; ++i) {
    const pointPosition = points[i];
    const nextPointPosition = points[ (i + 1) % ( points.length - 1) ];

    const constraint:DistanceConstraint = new DistanceConstraint(
    i,
    (i + 1) % (points.length - 1),
    3,
    pointPosition.distanceTo(nextPointPosition),
    0.5);
    state.constraints.push(constraint);
  }

  state.testObject = mesh;
  return mesh;
}