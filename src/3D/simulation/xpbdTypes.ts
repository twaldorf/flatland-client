import * as THREE from "three";
import { sparseLog } from "../../utils/devutils";

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

export class DistanceConstraint {
  p1: number;         // index of the first particle
  p2: number;         // index of the second particle
  stride: number;
  restLength: number; // desired length between particles
  compliance: number; // softness parameter (0 for stiff constraints)
  lambda: number;     // Lagrange multiplier (per constraint, maintained over iterations)
  delta: THREE.Vector3;

  constructor(p1: number, p2: number, stride:number, restLength: number, compliance: number) {
    this.p1 = p1;
    this.p2 = p2;
    this.stride = stride;
    this.restLength = restLength;
    this.compliance = compliance;
    this.lambda = 0;
    this.delta = new THREE.Vector3(0,0,0);
  }

  // XPBD constraint solve method.
  // deltaTime is the simulation time step.
  solve(deltaTime: number, particleObject ) {
    const { particles } = particleObject;
    const p_i = particles[this.p1].predicted;
    const p_j = particles[this.p2].predicted;
    const w_i = particles[this.p1].invMass;
    const w_j = particles[this.p2].invMass;
    // This could be included in the constraint instead of creating a new vector!

    this.delta.subVectors(p_i, p_j);
    const currentDist = this.delta.length();

    if (currentDist === 0) return;

    const C = currentDist - this.restLength;

    const wSum = w_i + w_j;

    // compliance term scaled by dt^2, should be almost infinite
    const alpha = this.compliance / (deltaTime * deltaTime);

    // lambda
    const dlambda = (-C) / (wSum + alpha);

    // Apply the correction scaled by the normalized gradient.
    const correction = this.delta.normalize().multiplyScalar(dlambda);

    if (w_i > 0) {
      p_i.addScaledVector(correction, w_i);
    }
    if (w_j > 0) {
      p_j.addScaledVector(correction, -w_j);
    }
  }
}