import { Quads } from './types'

// update buffer geometry
export default function addVertexToQuad ( quad:Quads, vertex:THREE.Vector3 ) {
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


