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
    var gridHelper = new THREE.GridHelper(stageSize, stageSize / 2);
    //gridHelper.position.y = 1;
    scene.add(gridHelper);
}

function initializeStageMaterial() {
    var textureLoader = new THREE.TextureLoader();
    var maxAnisotropy = renderer.getMaxAnisotropy();

    var texture = textureLoader.load("assets/texture/hardwood-smaller.jpg");
    var material = new THREE.MeshBasicMaterial({ map: texture });

    texture.anisotropy = maxAnisotropy;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40); //Creates the floorboard design

    var geometry = new THREE.PlaneGeometry(stageSize, stageSize);

    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = - Math.PI / 2;
    //mesh1.scale.set( 2, 2, 2 );
    scene.add(mesh);
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
    var toAdd = new Person(spawnPersonHorizontal, spawnPersonVertical, "name" + numPersons, "pid_" + numPersons);
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