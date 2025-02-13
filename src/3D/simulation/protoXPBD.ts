import * as THREE from 'three';
import { state } from '../../State';
import { Particle, DistanceConstraint } from './xpbdTypes';


// export var particles: Particle[] = []; // fill with your particle data
// export var constraints: DistanceConstraint[] = []; // fill with your constraint definitions
// state.particles = particles;
// state.constraints = constraints;
// const particles = state.particles;
// const constraints = state.constraints;

// For collisions, we’ll resolve with a simple floor at y = 0.
function resolveCollisions(particle: Particle, floorY: number) {
  if (particle.predicted.y < floorY) {
    // Push the particle back to the floor.
    particle.predicted.y = floorY;
  }
}

// The main update function where XPBD and collision handling occur.
export function updateXPBD(deltaTime: number) {

  // --- 1. Predict positions by applying external forces (e.g., gravity)
  const gravity = new THREE.Vector3(0, -9.81, 0);
  for (const particle of state.particles) {
    if (particle.invMass > 0) {
      // Update velocity with gravity
      particle.velocity.addScaledVector(gravity, deltaTime);

      // Predict new position
      particle.predicted.copy(particle.position);
      particle.predicted.addScaledVector(particle.velocity, deltaTime);
    }
  }

  // // --- 2. Resolve collisions for each particle (e.g. against the floor at y = 0)
  // for (const particle of particles) {
  //   resolveCollisions(particle, 0);
  // }

  // // --- 3. Iteratively solve constraints (XPBD)
  // const iterations = 10; // Number of solver iterations
  // for (let iter = 0; iter < iterations; iter++) {
  //   for (const constraint of constraints) {
  //     constraint.solve(deltaTime, particles);
  //   }
  // }

  // --- 4. Update velocities and positions using the predicted positions
  for (const particle of state.particles) {
    particle.position.setComponent(0, particle.position.getComponent(0) + 1)
    if (particle.positionIndex == 0) {
      console.log(particle.position.x)
    }
  // for (let i = 0; i < particles.length; ++i) {
    // console.log(i)
    // const particle = particles[i];
    // Compute new velocity based on the change in position
    particle.velocity.copy(particle.predicted).sub(particle.position).divideScalar(deltaTime);
    // Update actual position to the corrected predicted position
    // particle.position.copy(particle.predicted);

    if (particle.positionIndex == 0) {
      console.log('after', particle.position.x)
    }

    const positionAttr = particle.geometry.getAttribute('position');
    positionAttr.setXYZ(particle.positionIndex, particle.position.x, particle.position.y, particle.position.z);
    positionAttr.needsUpdate = true;
    particle.geometry.attributes.position.needsUpdate = true;
    particle.geometry.computeBoundingSphere();
    // state.testObject.geometry = particle.geometry;
    // console.log(particles[i] === particle)
    
  }

}
