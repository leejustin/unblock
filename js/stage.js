/* 
 * A stage is conceptually the 2D plane where objects 
 * (such as persons) are placed. 
 */

var personMap = {};

//Coordinates where a person will spawn
let spawnPersonHorizontal = -12;
let spawnPersonVertical = -12;

function initializeStageGrid(lines, steps, gridColor) {
  lines = lines || 20;
  steps = steps || 2;
  gridColor = gridColor || 0x606060;
  var stageGrid = new THREE.Geometry();
  var gridLine = new THREE.LineBasicMaterial( {color: gridColor} );
  for (var i = -lines; i <= lines; i += steps) {
    stageGrid.vertices.push(new THREE.Vector3(-lines, 0, i));
    stageGrid.vertices.push(new THREE.Vector3( lines, 0, i));
    stageGrid.vertices.push(new THREE.Vector3( i, 0, -lines));
    stageGrid.vertices.push(new THREE.Vector3( i, 0, lines));
  }
  return new THREE.Line(stageGrid, gridLine, THREE.LinePieces);
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
