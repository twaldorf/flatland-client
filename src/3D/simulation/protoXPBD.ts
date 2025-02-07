import * as THREE from 'three';

// A simple particle representing a vertex in your mesh.
interface Particle {
  position: THREE.Vector3;      // current position
  previousPosition: THREE.Vector3; // for computing velocity
  velocity: THREE.Vector3;
  predicted: THREE.Vector3;     // predicted (temporary) position
  invMass: number;              // 0 means static
}

// A distance constraint between two particles using XPBD.
class DistanceConstraint {
  p1: number;         // index of the first particle
  p2: number;         // index of the second particle
  restLength: number; // desired length between particles
  compliance: number; // softness parameter (0 for stiff constraints)
  lambda: number;     // Lagrange multiplier (per constraint, maintained over iterations)

  constructor(p1: number, p2: number, restLength: number, compliance: number) {
    this.p1 = p1;
    this.p2 = p2;
    this.restLength = restLength;
    this.compliance = compliance;
    this.lambda = 0;
  }

  // XPBD constraint solve method.
  // deltaTime is the simulation time step.
  solve(deltaTime: number, particles: Particle[]) {
    const p_i = particles[this.p1].predicted;
    const p_j = particles[this.p2].predicted;
    const w_i = particles[this.p1].invMass;
    const w_j = particles[this.p2].invMass;
    const delta = new THREE.Vector3().subVectors(p_i, p_j);
    const currentDist = delta.length();
    if (currentDist === 0) return;
    const C = currentDist - this.restLength;
    const wSum = w_i + w_j;
    // XPBD uses a compliance term scaled by dt².
    const alpha = this.compliance / (deltaTime * deltaTime);
    // Compute the incremental Lagrange multiplier.
    const dlambda = (-C - alpha * this.lambda) / (wSum + alpha);
    this.lambda += dlambda;
    // Apply the correction scaled by the normalized gradient.
    const correction = delta.normalize().multiplyScalar(dlambda);
    if (w_i > 0) {
      p_i.addScaledVector(correction, w_i);
    }
    if (w_j > 0) {
      p_j.addScaledVector(correction, -w_j);
    }
  }
}

// Example arrays of particles and constraints.
// In your application, you would extract the particles from your mesh vertices.
export var particles: Particle[] = []; // fill with your particle data
export var constraints: DistanceConstraint[] = []; // fill with your constraint definitions

// For collisions, we’ll resolve with a simple floor at y = 0.
function resolveCollisions(particle: Particle, floorY: number) {
  if (particle.predicted.y < floorY) {
    // Push the particle back to the floor.
    particle.predicted.y = floorY;
  }
}

// The main update function where XPBD and collision handling occur.
function update(deltaTime: number) {
  // --- 1. Predict positions by applying external forces (e.g., gravity)
  const gravity = new THREE.Vector3(0, -9.81, 0);
  for (const particle of particles) {
    if (particle.invMass > 0) {
      // Update velocity with gravity
      particle.velocity.addScaledVector(gravity, deltaTime);
      // Predict new position
      particle.predicted.copy(particle.position).addScaledVector(particle.velocity, deltaTime);
    }
  }

  // --- 2. Resolve collisions for each particle (e.g. against the floor at y = 0)
  for (const particle of particles) {
    resolveCollisions(particle, 0);
  }

  // --- 3. Iteratively solve constraints (XPBD)
  const iterations = 10; // Number of solver iterations
  for (let iter = 0; iter < iterations; iter++) {
    for (const constraint of constraints) {
      constraint.solve(deltaTime, particles);
    }
  }

  // --- 4. Update velocities and positions using the predicted positions
  for (const particle of particles) {
    // Compute new velocity based on the change in position
    particle.velocity.copy(particle.predicted).sub(particle.position).divideScalar(deltaTime);
    // Update actual position to the corrected predicted position
    particle.position.copy(particle.predicted);
  }

  // (Optional) Update your mesh geometry to reflect new particle positions.
  // For example, if using BufferGeometry, update the 'position' attribute.
  // geometry.attributes.position.needsUpdate = true;
}
