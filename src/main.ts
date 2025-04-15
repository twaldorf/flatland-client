// Controller module
import * as THREE from 'three'
import { mouseOverCanvas } from './util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { state } from './State';
import { executeCommands } from './Command';
import { onPointerMove, onPointerDown, onPointerUp, onDoubleClick } from './3D/events/pointer';
import { initializeHotkeys } from './2D/hotkeys/hotkeys';
import { initializeCanvasEvents } from './2D/pointer/pointerEvents';
import { drawCanvasSetup } from './2D/rendering/canvas';
import { updateXPBD } from './3D/simulation/protoXPBD';
import { SPEED } from './2D/settings/factors';

// This file initializes 2D and 3D canvases and runs the global update loop (which processes all Commands for the canvases)

// 2D initialization
export function initCanvas(ref:HTMLCanvasElement) {
  // Get a reference to the canvas element and its rendering context
  const canvas = ref;
  state.canvas = canvas;

  const context = canvas.getContext( "2d" );
  if (!context) {
    throw new Error('No such 2D context when initializing page elements');
  }
  state.context = context;

  context?.clearRect(0, 0, canvas.width, canvas.height);

  var lastPoint = { x: 0, y: 0 };

  initializeHotkeys();
  state.tool.initializeEvents();
  initializeCanvasEvents(canvas);

  if (context) {
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    // scaling removed, may need to add if this becomes a problem?
    
    drawCanvasSetup();

  }

  return { canvasRef: state.canvas };
}

// 3D initialization
export function initScene(canvas:HTMLCanvasElement) {
  state.renderer = new THREE.WebGLRenderer( { canvas } );
  const renderer = state.renderer;
  renderer.setSize( window.innerWidth / 2, window.innerWidth / 2 );

  const scene = new THREE.Scene();
  state.scene = scene;
  const camera_group = new THREE.Group();

  const frustumSize = 25;
  const aspect = renderer.domElement.clientWidth / renderer.domElement.clientHeight;
  const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 0.1, 1000 );
  state.camera = camera;
  camera_group.add(camera);
  
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.rotateSpeed = .1;
  state.camera_controls = controls;
  camera.position.set(0, 50, 100);
  camera.lookAt(0,0,0);

  scene.background = new THREE.Color( 0xF5CF36 );

  const gridHelper = new THREE.GridHelper( 500, 40, new THREE.Color(1, 1, 1), new THREE.Color(0.8, 0.4, .3));
	scene.add( gridHelper );

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  state.raycaster = raycaster;
  state.pointer = pointer;

  // register event listeners
  renderer.domElement.addEventListener( 'pointermove', onPointerMove );
  renderer.domElement.addEventListener( 'pointerdown', onPointerDown );
  renderer.domElement.addEventListener( 'pointerup', onPointerUp );
  renderer.domElement.addEventListener( 'dblclick', onDoubleClick );
  state.pointerDown = false;

  // kick off update
  renderer.render(state.scene, state.camera);
  update();
  return { threeRef: parent };
}

// Local deltatime, not tracked as state
let dt = 0.0;
const interval = 1/30;

// Render and global command processing loop
function update() {
  const { pointer, camera, scene, renderer, raycaster } = state;
  const [ mesh, line ] = state.objects;
  executeCommands();
  requestAnimationFrame( update );
  dt += state.clock.getDelta();
  
  if (mouseOverCanvas(state) === true && dt > interval && state.c_shapes.length > 0) {
    updateXPBD(dt * SPEED);
    dt = 0;

    // update the picking ray with the camera and pointer position 
    camera.updateMatrixWorld();
    raycaster.setFromCamera( pointer, camera );
    
    const intersects = raycaster.intersectObjects( state.objects );
    state.intersects = intersects;
    
    if ( intersects.length > 0 ) {
      const intersect = intersects[ 0 ];
      // This is a good example of attribute management but is no longer used
      // TODO move this or file it away in documentation
      // const face = intersect.face;
      
      // const linePosition = line.geometry.attributes.position;
      // const meshPosition = mesh.geometry.attributes.position;
      
      // linePosition.copyAt( 0, meshPosition, face.a );
      // linePosition.copyAt( 1, meshPosition, face.b );
      // linePosition.copyAt( 2, meshPosition, face.c );
      // linePosition.copyAt( 3, meshPosition, face.a );
      
      // mesh.updateMatrix(); 
      
      // line.geometry.applyMatrix4( mesh.matrix );
      
      // line.visible = true;
      
    } else {
      // line.visible = false;
    }
  }

  state.camera_controls.update();
  renderer.render( scene, camera );

}

