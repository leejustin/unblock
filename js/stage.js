/* 
 * A stage is conceptually the 2D plane where objects 
 * (such as persons) are placed. 
 */

var personMap = {};

//Coordinates where a person will spawn
let spawnPersonHorizontal = -12;
let spawnPersonVertical = -12;

let stageSize = 40;

function initializeStageGrid() {
    return new THREE.GridHelper( stageSize, stageSize/2 );
}

function initializeStageMaterial() {
    /*
  var textureImage = 'assets/texture/crate-small.jpg';
  var geometry = new THREE.BoxGeometry( size, size, size );
  var crateTexture = new THREE.ImageUtils.loadTexture( textureImage );
  var crateMaterial = new THREE.MeshLambertMaterial({ map: crateTexture });
  var crate = new THREE.Mesh( geometry, crateMaterial );
  return crate;
  */

    var texture, material, plane;

    texture = THREE.TextureLoader( 'assets/texture/crate-small.jpg' );

    // assuming you want the texture to repeat in both directions:
    //texture.wrapS = THREE.RepeatWrapping; 
    //texture.wrapT = THREE.RepeatWrapping;

    // how many times to repeat in each direction; the default is (1,1),
    //   which is probably why your example wasn't working
    texture.repeat.set( 4, 4 ); 

    material = new THREE.MeshLambertMaterial({ map : texture });
    plane = new THREE.Mesh(new THREE.PlaneGeometry(1400, 3500), material);
    plane.material.side = THREE.DoubleSide;
    plane.position.x = 100;

    // rotation.z is rotation around the z-axis, measured in radians (rather than degrees)
    // Math.PI = 180 degrees, Math.PI / 2 = 90 degrees, etc.
    plane.rotation.z = Math.PI / 2;

    scene.add(plane);
}

/* Redraws the entire board with person objects -- board should be cleared first */
function initializePersons() {
  for (var key in personMap) {
    scene.add(personMap[key].meshObject);
  }
}

/* Clears the stage of all person objects */ 
function removeAllPersons() {
  objectTransformControl.detach();

  for (var key in personMap) {
    var selectedObject = scene.getObjectByName(personMap[key].pid);
    scene.remove(selectedObject);
  }
}

/* Create and add a person to the spawn location */
function addPerson() {
  var numPersons = Object.keys(personMap).length;
  var toAdd = new Person(spawnPersonHorizontal, spawnPersonVertical, "name" + numPersons,"pid_" + numPersons);
  personMap["pid_" + numPersons] = toAdd;

  objectTransformControl.attach(toAdd.meshObject);
  scene.add(toAdd.meshObject);
}

/* TODO: break this into a service layer once we get a bit more organized with framework decisions, etc...*/

/* Store the Persons that are on the stage*/
function saveStagePersons() {
  //TODO: look at some proper deep copying
  //TODO: need to set up extra functionality to only store the person data without meshes
  var toStore = JSON.parse(JSON.stringify(personMap));
  
  return toStore;
}