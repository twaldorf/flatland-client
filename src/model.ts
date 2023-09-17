import * as THREE from 'three';
import { Pattern, Quads, State } from './types'

// update buffer geometry
export default function addVertexToQuad ( quad:Quads, vertex:THREE.Vector3, state:State ) {
  // the draw range will always be the number of vertices
  quad.geometry.getAttribute( 'position' ).setXYZ( quad.n_vertices, vertex.x, vertex.y, vertex.z );
  quad.n_vertices += 1;

  if ( quad.n_vertices == 4 ) {
    const index = [
      0,1,2,
      2,3,0
    ];
    quad.geometry.setIndex( index );
    quad.geometry.setDrawRange( 0, quad.n_vertices * 3 );
    drawFlat( { pieces: [ {quads: [quad], vertices: [], edges: [] } ], seams: [] }, state );
  }
}

// TODO move to util
// Create new triangle indices for the new quad
// Copy new indices to the geometry index
const updateIndices = (n:number, geometry:THREE.BufferGeometry) => {
  // TODO: check and correct winding order when vertices are added CW
  // build array of vertex indices for two tris (CCW)
  const index = ( n / 2 ) * 3 - 6;
}


const drawFlat = ( pattern:Pattern, state:State ) => {
  const ctx = state.context;

  for (let piece of pattern.pieces) {
    let x = 0;
    ctx?.beginPath();
    let start_flag = true;

    for (let i = 0; i <= piece.quads.length; i++) {
      const quad = piece.quads[i % piece.quads.length];
      const points = projectQuad( quad );
      ctx.lineWidth = 10;

      for (let xy of points) {
        const x = 100 + 100 * xy[0];
        const y = 100 + 100 * xy[1];
        if (start_flag) {
          ctx?.moveTo( x, y );
          start_flag = false;
        }
        ctx?.lineTo( x, y );
      }

    }
    ctx?.closePath();
    ctx?.stroke();
  }
}

const projectQuad = ( quad:Quads ) => {
  let result = new Array<Array<number>>;
  for (let i = 0; i < 4; i++) {
    const x = quad.geometry.getAttribute( 'position' ).getX( i );
    const y = quad.geometry.getAttribute( 'position' ).getY( i ); 
    result.push( [ x, y ] );
  }
  return result;
}

