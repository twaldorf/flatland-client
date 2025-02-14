// Controller module
import * as THREE from 'three'
import { mouseOverCanvas } from './util'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { state } from './State';
import { executeCommands, pushCommand } from './Command';
import { onPointerMove, onPointerDown, onPointerUp, onDoubleClick } from './3D/events/pointer';
import { createRectangularPrism } from './3D/geometry/primitives';
import { initializeHotkeys } from './2D/hotkeys/hotkeys';
import { initializeCanvasEvents } from './2D/pointer/pointerEvents';
import { drawYRuler } from './2D/canvas';
import { updateXPBD } from './3D/simulation/protoXPBD';

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

  var lastPoint = {x: 0, y: 0};

  initializeHotkeys();
  state.tool.initializeEvents();
  initializeCanvasEvents(canvas);

  if (context) {
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    context.scale(devicePixelRatio, devicePixelRatio);

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawYRuler();

  return { canvasRef: state.canvas };
}

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
  camera.position.z = 100;
  camera.lookAt(0,0,0);
  camera_group.add(camera);
  
  const controls = new OrbitControls(camera, renderer.domElement);

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
  
  // test scene
  // drawTestGeometry();
  // drawTestPrimitive();
  
  // kick off update
  renderer.render(state.scene, state.camera);
  update();
  return { threeRef: parent };
}

const drawTestPrimitive = () => {
  const prismPair = createRectangularPrism(new THREE.Vector3(0,0,0), 10, 5, 2);
  state.scene.add( prismPair.mesh );
  state.scene.add( prismPair.line );
  state.objects = [ prismPair.mesh, prismPair.line ];
}

const drawTestGeometry = () => {
  // initialize buffer geometry
  const test_geometry = new THREE.BufferGeometry(  );

  const ARRAY_MAX = 500 * 3;
  // const vertices = new Float32Array( ARRAY_MAX );
  // test vertices, two tris forming a quad:
  const vertices = new Float32Array( [
    -1.0, -1.0,  1.0, // v0
     1.0, -1.0,  1.0, // v1
     1.0,  1.0,  1.0, // v2
  
     1.0,  1.0,  1.0, // v3
    -1.0,  1.0,  1.0, // v4
    -1.0, -1.0,  1.0  // v5
  ] );

  const test_quad = { geometry: test_geometry, n_vertices: 4 };
  
  test_geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  test_geometry.setDrawRange( 0, 12 );
  
  const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  const line_material = new THREE.MeshBasicMaterial( { color: "#ffffff"} );
  const mesh = new THREE.Mesh( test_geometry, material );
  const line = new THREE.Line( test_geometry, line_material );

  state.scene.add( mesh );
  state.scene.add( line );
  state.objects = [ mesh, line];

  test_geometry.computeBoundingSphere();
  
  // console.log( test_geometry.index )
  // END BUFFER GEOMETRY INIT SPACE
}

function drawQuad(geometry:THREE.BufferGeometry) {

}

// Local deltatime, not tracked as state
let dt = 0.0;
const interval = 1/30;

function update() {
  const { pointer, camera, scene, renderer, raycaster } = state;
  const [ mesh, line ] = state.objects;
  executeCommands();
  requestAnimationFrame( update );
  dt += state.clock.getDelta();
  
  if (mouseOverCanvas(state) === true && dt > interval) {
    updateXPBD(dt);
    dt = 0;

    // update the picking ray with the camera and pointer position 
    camera.updateMatrixWorld();
    raycaster.setFromCamera( pointer, camera );
    
    const intersects = raycaster.intersectObjects( state.objects );
    state.intersects = intersects;
    
    if ( intersects.length > 0 ) {
      const intersect = intersects[ 0 ];
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
    
    renderer.render( scene, camera );
  }


}

