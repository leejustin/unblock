/*-------JSHint Directives-------*/
/* global THREE, dat             */
/*-------------------------------*/
'use strict';

/*******************
 * Manage Settings *
 *******************/
var CAMERA = {
  fov: 45,
  near: window.innerWidth / window.innerHeight,
  far: 1000,
  zoomX: 0,//-0.25,
  zoomY: 40,//27,
  zoomZ: 40,//48,
};

var CONTROLS = {
  enabled: true,
  userPan: true,
  userPanSpeed: 1,
  minDistance: 10.0,
  maxDistance: 200.0,
  maxPolarAngle: (Math.PI / 180) * 80,
};

var RENDERER = {
  antialias: false,
};

let GRID_UNITS = 1;

/********************
 * Global Variables *
 ********************/
// Built-in
var scene, camera, mouse, raycaster, renderer;

// Plugins
var controls, gui, objectTransformControl;

/***********************
 * Rendering Functions *
 ***********************/
function renderScene() {
  renderer.render(scene, camera);
}

function updateScene() {
  controls.update();
}

function animateScene() {
  window.requestAnimationFrame(animateScene);
  renderScene();
  updateScene();
}

function resizeWindow() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addToDOM(object) {
  var container = document.getElementById('canvas-body');
  container.appendChild(object);
}

/************************
 * Scene Initialization *
 ************************/
function initializeScene() {
  /*************************
   * Initialize Essentials *
   *************************/

  // Scene and window resize listener
  scene = new THREE.Scene();
  var canvasWidth = window.innerWidth;
  var canvasHeight = window.innerHeight * 0.8;
  window.addEventListener('resize', resizeWindow, false);


  // Camera and set initial view
  var aspectRatio = canvasWidth / canvasHeight;
  camera = new THREE.PerspectiveCamera(CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far);
  camera.position.set(CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ);
  camera.lookAt(scene.position);
  scene.add(camera);

  // Add WebGL renderer to DOM
  renderer = new THREE.WebGLRenderer(RENDERER);
  renderer.setSize(canvasWidth, canvasHeight);
  addToDOM(renderer.domElement);

  /**********************
   * Initialize Plugins *
   **********************/

  // OrbitControls using mouse
  controls = new THREE.OrbitControls(camera);
  for (var key in CONTROLS) { controls[key] = CONTROLS[key]; }
  controls.addEventListener('change', renderScene);
				var ambientLight = new THREE.AmbientLight( Math.random() * 0x202020 );
				scene.add( ambientLight );
				var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
				directionalLight.position.set( 0, 1, 0 );
				scene.add( directionalLight );
				var light = new THREE.PointLight( 0xff0000, 1, 500 );
				scene.add( light );

  // Dat gui (top right controls)
  //gui = new dat.GUI( {height: 5 * 32 - 1} );

  // Set up the floor grid and texture
  initializeStageGrid();
  //initializeStageMaterial();
  scene.background = new THREE.Color(0xffffff);

  // Set up the Persons to be placed on the stage
  testInitPersons(); //TEMP FOR TESTING
  initializePersons();

  // Set up the transform controls to move Persons
  objectTransformControl = new THREE.TransformControls(camera, renderer.domElement);
  objectTransformControl.setTranslationSnap(GRID_UNITS);
  objectTransformControl.addEventListener('change', transformPerson);
  scene.add(objectTransformControl);

  // Set up raycaster to detect clicks on objects
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  document.addEventListener('mousedown', onDocumentMouseDown, false);
}

//Used to update a person's coordinates after being moved by the transform controller
function transformPerson() {
  var horizontal = objectTransformControl.position.x;
  var vertical = objectTransformControl.position.z;
  var pid = objectTransformControl.object.id;
  console.log("pid of transformed person: " + pid);

  var person = scene.getObjectById(pid);
  person.position.set(horizontal, 1, vertical);
  
  //setPosition(horizontal, vertical);
}

function onDocumentMouseDown(event) {
  //event.preventDefault();
  var rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(personArray);

  //Object was clicked
  if (intersects.length > 0) {
    console.log("Object " + intersects[0].object.name + " was clicked");
    objectTransformControl.attach(intersects[0].object);
  }
}

/******* DUMP OF TEMPORARY TESTING STUFF ********/
function testInitPersons() {
  personArray.push(new Person(0, 0, "justin"));
  personArray.push(new Person(4, 3, "hello"));
  personArray.push(new Person(-3, -6, "Taco"));
}

/******** END TESTING STUFF *************** */

/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();

//TODO -- add camera controls to change to different views, such as close up, audience angle, etc.


function testy() {
        var loader = new THREE.JSONLoader();
        var callbackMale = function ( geometry, materials ) { createScene( geometry, materials, 0, FLOOR, 0, 105 ) };
        loader.load( 'assets/person/male02/Male02_dds.js', callbackMale );
}
      
			var mesh, zmesh, geometry;
			var FLOOR = 0;
			function createScene( geometry, materials, x, y, z, b ) {
				zmesh = new THREE.Mesh( geometry, materials );
				zmesh.position.set( x, y, z );
				zmesh.scale.set( 0.02, 0.02, 0.02 );
				scene.add( zmesh );
				//createMaterialsPalette( materials, 100, b );
			}
/*
			function createMaterialsPalette( materials, size, bottom ) {
				for ( var i = 0; i < materials.length; i ++ ) {
					// material
					mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( size, size ), materials[i] );
					mesh.position.x = i * (size + 5) - ( ( materials.length - 1 )* ( size + 5 )/2);
					mesh.position.y = FLOOR + size/2 + bottom;
					mesh.position.z = -100;
					scene.add( mesh );
					// number
					var x = document.createElement( "canvas" );
					var xc = x.getContext( "2d" );
					x.width = x.height = 10;
					xc.shadowColor = "#000";
					xc.shadowBlur = 7;
					xc.fillStyle = "orange";
					xc.font = "50pt arial bold";
					xc.fillText( i, 10, 64 );
					var xm = new THREE.MeshBasicMaterial( { map: new THREE.CanvasTexture( x ), transparent: true } );
					mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( size, size ), xm );
					mesh.position.x = i * ( size + 5 ) - ( ( materials.length - 1 )* ( size + 5 )/2);
					mesh.position.y = FLOOR + size/2 + bottom;
					mesh.position.z = -99;
					scene.add( mesh );
				}
			}*/
