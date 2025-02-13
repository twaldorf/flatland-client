import * as THREE from "three";

// A simple particle representing a vertex in your mesh.
export interface Particle {
  position: THREE.Vector3;
  positionArray: THREE.BufferAttribute;      // current position
  positionIndex: number;
  previousPosition: THREE.Vector3; // for computing velocity
  velocity: THREE.Vector3;
  predicted: THREE.Vector3;     // predicted (temporary) position
  invMass: number;              // 0 means static
  geometry: THREE.BufferGeometry;
}

// A distance constraint between two particles using XPBD.
export class DistanceConstraint {
  p1: number;         // index of the first particle
  p2: number;         // index of the second particle
  stride: number;
  restLength: number; // desired length between particles
  compliance: number; // softness parameter (0 for stiff constraints)
  lambda: number;     // Lagrange multiplier (per constraint, maintained over iterations)

  constructor(p1: number, p2: number, stride:number, restLength: number, compliance: number) {
    this.p1 = p1;
    this.p2 = p2;
    this.stride = stride;
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