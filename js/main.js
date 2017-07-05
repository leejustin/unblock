/*-------JSHint Directives-------*/
/* global THREE, dat             */
/*-------------------------------*/
'use strict';


/*******************
 * Manage Settings *
 *******************/
var CAMERA = {
  fov : 50,
  near : 1,
  far : 1000,
  zoomX : 0,
  zoomY : 20,
  zoomZ : 30,
};

var CONTROLS = {
  enabled : true,
  userPan : true,
  userPanSpeed : 1,
  minDistance : 10.0,
  maxDistance : 200.0,
  maxPolarAngle : (Math.PI/180) * 80,
};

var RENDERER = {
  antialias : false,
};

let GRID_UNITS = 2;


/********************
 * Global Variables *
 ********************/
// Built-in
var scene, camera, mouse, raycaster, renderer;

// Plugins
var controls, gui, objectTransformControl;

// Scene objects
//var crate;

// Person objects
var personMap = {};

/********************
 * Helper Functions *
 ********************/
function basicFloorGrid(lines, steps, gridColor) {
  lines = lines || 20;
  steps = steps || 2;
  gridColor = gridColor || 0x606060;
  var floorGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    floorGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    floorGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  return new THREE.Line(floorGrid, gridLine, THREE.LinePieces);
}


/*
function basicCrate(size) {
  size = size || 5;
  var textureImage = 'assets/texture/crate-small.jpg';
  var geometry = new THREE.BoxGeometry( size, size, size );
  var crateTexture = new THREE.ImageUtils.loadTexture( textureImage );
  var crateMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });
  var crate = new THREE.Mesh( geometry, crateMaterial );
  return crate;
}
*/


/***********************
 * Rendering Functions *
 ***********************/
function renderScene() {
  renderer.render( scene, camera );
}

function updateScene() {
  controls.update();
}

function animateScene() {
  window.requestAnimationFrame( animateScene );
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
  var canvasWidth  = window.innerWidth;
  var canvasHeight = window.innerHeight;
  window.addEventListener('resize', resizeWindow, false);

  // Camera and set initial view
  var aspectRatio  = canvasWidth/canvasHeight;
  camera = new THREE.PerspectiveCamera( CAMERA.fov, aspectRatio, CAMERA.near, CAMERA.far );
  camera.position.set( CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ );
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

  // Dat gui (top right controls)
  gui = new dat.GUI( {height: 5 * 32 - 1} );


  /***************
   * Custom Code *
   ***************/

  // Example: light sources
  /*
  var lightAmbient = new THREE.AmbientLight(0x666666);
  var lightSource = new THREE.PointLight(0x888888);
  lightSource.position.set(0, 50, 80);
  scene.add(lightAmbient);
  scene.add(lightSource);
  */

  // Set up the floor grid
  scene.add(basicFloorGrid(15, GRID_UNITS));

  /*
  var crateSize = 5;
  crate = basicCrate(crateSize);
  crate.position.set(0, crateSize/2, 0);
  scene.add(crate);
  */

  testInitPersons(); // temp
  initializePersons();


  objectTransformControl = new THREE.TransformControls(camera, renderer.domElement);
  objectTransformControl.setTranslationSnap(GRID_UNITS);


  objectTransformControl.addEventListener('change', transformPerson);
  objectTransformControl.attach(personMap["pid_0"].meshObject);
  scene.add(objectTransformControl);




  //* test raycaster mouse clicks
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  document.addEventListener( 'mousedown', onDocumentMouseDown, false);
}


function onDocumentMouseDown(event) {
  //event.preventDefault();

  var rect = renderer.domElement.getBoundingClientRect();
  /*
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1.2;
  */
  mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
  mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );

  
  var personArray = [];
  for (var key in personMap) {
    personArray.push(personMap[key].meshObject);
  }
  var intersects = raycaster.intersectObjects(personArray);
  if ( intersects.length > 0 ) {
    console.log(intersects);
    console.log(intersects[0].object.name);
    console.log(intersects[0].object.position);
    //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );
    /*
    var particleMaterial = new THREE.SpriteCanvasMaterial( {

					color: 0x000000,
					program: function ( context ) {

						context.beginPath();
						context.arc( 0, 0, 0.5, 0, PI2, true );
						context.fill();

					}

				} );
    var particle = new THREE.Sprite( particleMaterial );
    particle.position.copy( intersects[ 0 ].point );
    particle.scale.x = particle.scale.y = 16;
    scene.add( particle );
    */
    console.log("TRUE!!");
  }
}


/******* JUST FOR TESTING  */
function testInitPersons() {
  personMap["pid_0"] = new Person(0,0,"justin")
  personMap["pid_1"] = new Person(4,3,"hello")
  personMap["pid_2"] = new Person(-3,-6,"Taco")
}

function test() {
  console.log("Moving object");
  //console.log(objectTransformControl.position);
  //test_updateLocation(objectTransformControl.object);
}

function test_updateLocation(attachedObject) {
  //console.log(attachedObject.name);

  //objectTransformControl.object;
}

function testTwo() {
  console.log(objectTransformControl);
  objectTransformControl.position;
  //objectTransformControl.detach();

  //persons[0].updatePosition(objectTransformControt)
}

/*********************** */

function transformPerson() {
  var horizontal = objectTransformControl.position.x;
  var vertical = objectTransformControl.position.z;
  var name = objectTransformControl.object.name;

  var person = personMap["pid_0"];  //TODO figure out best way to reference person
  person.updatePosition(horizontal, vertical);

}






//TODO - add function that will only add a single unit instead of redrawing the entire board

/* Redraws the entire board with person objects -- board should be cleared first */
function initializePersons() {
  for (var key in personMap) {
    scene.add(personMap[key].meshObject);
  }
}

/* Clears the stage of all person objects */ 
function removeAllPersons() {
  for (var key in personMap) {
    var selectedObject = scene.getObjectByName(personMap[key].name);
    scene.remove(selectedObject);
  }
}

//TODO - should only add a person and not actually redraw the entire board
function addPerson() {
  removeAllPersons();

  var numPersons = Object.keys(personMap).length;
  var toAdd = new Person(-12,-12,"name" + numPersons);
  personMap["pid_" + numPersons] = toAdd;

  initializePersons();
}















let personGeometry = new THREE.SphereGeometry(1, 32, 32);
let personMaterial = new THREE.MeshBasicMaterial( {color: 0x42a4f4} );
const personSize = 1;
 
class Person {
  constructor(coordHorizontal, coordVertical, name) {
    this.name = name;
    this.coordHorizontal = coordHorizontal;
    this.coordVertical = coordVertical;

    this.meshObject = new THREE.Mesh(personGeometry, personMaterial);
    this.meshObject.position.set(this.coordHorizontal, 1, this.coordVertical);
    this.meshObject.name = name;
  }

  updatePosition(updatedHorizontal, updatedVertical) {
    this.coordHorizontal = updatedHorizontal;
    this.coordVertical = updatedVertical;
    this.meshObject.position.set(this.coordHorizontal, 1, this.coordVertical);
  }
}


/**********************
 * Render and Animate *
 **********************/
initializeScene();
animateScene();
