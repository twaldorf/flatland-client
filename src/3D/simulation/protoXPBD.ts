import * as THREE from 'three';
import { state } from '../../State';
import { Particle, DistanceConstraint } from './xpbdTypes';

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
      // Predict new position
      particle.predicted.copy(particle.position);

      // Add scaled velocity to predicted pos
      particle.predicted.addScaledVector(particle.velocity, deltaTime);

      // Add dt^2 * invMa*f_ext(x^n) to xpredicted
      const dtsq = Math.pow(deltaTime, 2);

      particle.predicted.addScaledVector(gravity, particle.invMass * dtsq);
    }
  }

  for (const particle of state.particles) {
    resolveCollisions(particle, 0);
  }

  const iterations = 1;
  for (let iter = 0; iter < iterations; iter++) {
    for (const constraint of state.constraints) {
      constraint.solve(deltaTime, { particles: state.particles });
    }
  }

  for (const particle of state.particles) {
    // Store previous position for later velocity calculation
    particle.previousPosition.copy(particle.position);

    // Update position
    particle.position.copy(particle.predicted);

    // Update geometry buffer
    const positionAttr = particle.geometry.getAttribute('position');
    positionAttr.setXYZ(particle.positionIndex, particle.position.x, particle.position.y, particle.position.z);
    positionAttr.needsUpdate = true;

    // Update velocity with possible Number guards (-> damping)
    particle.velocity.copy(particle.position);
    particle.velocity.sub(particle.previousPosition);
    particle.velocity.divideScalar(deltaTime);
  }

  state.particles[0].geometry.attributes.position.needsUpdate = true;
  state.particles[0].geometry.computeBoundingSphere();
}
