// Controller module
import * as THREE from 'three'
import { snapToGrid } from './util'
import addVertexToQuad from './model'
import { State } from './types';

var state:State;

// localize pointer position
function onPointerMove( event ) { 
  // calculate pointer position in normalized device coordinates 
  // (-1 to +1) for both components 
  state.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1; 
  state.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// click to add points
function onPointerDown( event ) {
  const x = snapToGrid(state.pointer.x);
  const y = snapToGrid(state.pointer.y);
  const vertex = new THREE.Vector3( 
    x,
    y,
    1.0
  );
  addVertexToQuad( test_quad, vertex );
}

function initScene() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  // register event listeners
  window.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener( 'pointerdown', onPointerDown );

  state = { ...state, scene, camera, renderer, pointer, raycaster };

  update();

}

const drawTestGeometry = () => {
  // BEGIN BUFFER GEOMETRY INIT SPACE
  // initialize buffer geometry
  const test_geometry = new THREE.BufferGeometry(  );

  const ARRAY_MAX = 500 * 3;
  const vertices = new Float32Array( ARRAY_MAX );

  const test_quad = { geometry: test_geometry, n_vertices: 0 };

  test_geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  test_geometry.setDrawRange( 0, 0 );

  const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const mesh = new THREE.Mesh( test_geometry, material );
  const line = new THREE.Line( test_geometry, material );
  state.scene.add( line );
  const positionAttribute = mesh.geometry.getAttribute( 'position' );
  state.scene.add( mesh );

  console.log( test_geometry.index )

  state.camera.position.z = 5;

  // END BUFFER GEOMETRY INIT SPACE
}

function drawQuad(geometry:THREE.BufferGeometry) {

}

function update() {
	requestAnimationFrame( update );
  const { pointer, camera, scene, renderer } = state;

  // update the picking ray with the camera and pointer position 
  state.raycaster.setFromCamera( pointer, camera ); 

  positionAttribute.needsUpdate = true;
	renderer.render( scene, camera );
}

initScene();