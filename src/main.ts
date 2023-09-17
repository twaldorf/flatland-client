// Controller module
import * as THREE from 'three'
import { snapToGrid } from './util'
import addVertexToQuad from './model'
import { Pattern, State } from './types';

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
  if ( state.selected ) {
    const vertex = new THREE.Vector3( 
      x,
      y,
      1.0
    );
    addVertexToQuad( state.selected , vertex, state );
  }
}

function initCanvas() {
  // Get a reference to the canvas element and its rendering context
  const canvas = document.getElementById( "canvas" ) as HTMLCanvasElement;
  const context = canvas?.getContext( "2d" );
  state.context = context;

  if (context) {
    // Get the device pixel ratio
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set the canvas size to match its container and scale for retina screens
    canvas.width = window.innerWidth / devicePixelRatio - 10;
    canvas.height = canvas.parentElement.clientHeight / devicePixelRatio;

    // Scale the canvas drawing context to match the device pixel ratio
    context.scale(devicePixelRatio, devicePixelRatio);

    // You can now use the 'context' variable to draw on the canvas
    context.fillStyle = 'blue';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Example: Draw a red rectangle on the canvas
    context.fillStyle = 'red';
    context.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);
  }
}

function initScene() {

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth / 2 - 10, window.innerHeight );
  renderer.domElement.style += " display: inline; ";
  document.getElementById( 'main' )?.appendChild( renderer.domElement );

  scene.background = new THREE.Color( 0xF5CF36 );

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  // register event listeners
  window.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener( 'pointerdown', onPointerDown );

  state = { ...state, scene, camera, renderer, pointer, raycaster };

  // test scene
  drawTestGeometry();

  update();

}

const drawTestGeometry = () => {
  // BEGIN BUFFER GEOMETRY INIT SPACE
  // initialize buffer geometry
  const test_geometry = new THREE.BufferGeometry(  );

  const ARRAY_MAX = 500 * 3;
  const vertices = new Float32Array( ARRAY_MAX );

  const test_quad = { geometry: test_geometry, n_vertices: 0 };
  state.selected = test_quad;

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

  state.selected.geometry.getAttribute( 'position' ).needsUpdate = true;
	renderer.render( scene, camera );
}

initScene();
initCanvas();