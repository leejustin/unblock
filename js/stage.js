/* 
 * A stage is conceptually the 2D plane where objects 
 * (such as persons) are placed. 
 */
var formations = [];    //use formations to hold a personArray
var personArray = [];

var gridHelper;
var stageMesh;

var gridHelperIsVisible;
var stageMeshIsVisible;

//Coordinates where a person will spawn
let spawnPersonHorizontal = -12;
let spawnPersonVertical = -12;

let stageSize = 40;

function initializeStageGrid() {
    gridHelper = new THREE.GridHelper(stageSize, stageSize / 2);
    //gridHelper.position.y = 1;
    gridHelperIsVisible = true;
    scene.add(gridHelper);
}

function toggleStageGrid() {
    if (gridHelperIsVisible) {
        gridHelperIsVisible = false;
        scene.remove(gridHelper);
    } else {
        gridHelperIsVisible = true;
        scene.add(gridHelper);
    }
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

    stageMesh = new THREE.Mesh(geometry, material);
    stageMesh.rotation.x = - Math.PI / 2;
    //mesh1.scale.set( 2, 2, 2 );
    scene.add(stageMesh);
}

/* Redraws the entire board with person objects -- board should be cleared first */
function initializePersons() {
    if (formations.length < 1) {
        formations.push(personArray);
    }
    for (person of personArray) {
        scene.add(person);
    }
}

/* Clears the stage of all person objects */
function removeAllPersons() {
    objectTransformControl.detach();
    
    for (person of personArray) {
        scene.remove(person);
    }
}

/* Removes a single person */
function removePerson(pid) {
    if (pid != null) {
        var toRemove = scene.getObjectById(pid);

        //Detach the transform control if it's attached to this Person
        if (objectTransformControl.position.x == toRemove.position.x && 
            objectTransformControl.position.y == toRemove.position.y) {
            objectTransformControl.detach();
        }

        scene.remove(toRemove);
        for (var i = 0; i < personArray.length; i++) {
            if (personArray[i] == toRemove) {
                personArray.splice(i,1);
            }
        }
    }
}

/* Create and add a person to the spawn location */
function addPerson(alias = "no_alias") {
    var toAdd = new Person(spawnPersonHorizontal, spawnPersonVertical, alias);
    personArray.push(toAdd);

    objectTransformControl.attach(toAdd);
    scene.add(toAdd);
}

/* Return the id of the person with the object transform */
function getSelectedPerson() {
    try {
        return objectTransformControl.object.id;
    } catch(e) {
        return;
    }
}

/* Set the current formation to a new or existing one.  Return the index of the newly-created formation */
function createAndSetFormation(formationIndex = null) {
    var personArrayToUse;

    if (formationIndex != null && formationIndex < formations.length) {
        personArrayToUse = clonePersonArray(formations[formationIndex]);
        //console.log(personArrayToUse);
    } else {
        personArrayToUse = new Array();
    }

    formations.push(personArrayToUse);
    var createdFormationIndex = formations.length - 1;
    console.log("Created formation at index: " + createdFormationIndex);

    setFormation(createdFormationIndex);
    return createdFormationIndex;
}

function setFormation(formationIndex) {
    removeAllPersons();
    personArray = formations[formationIndex];
    initializePersons();
}
/*
document.getElementById("formation-dropdown").onchange = function() {
    console.log("DO");
   var sheet=document.getElementById("formation-dropdown").value;

   if(sheet=="one"){
   setActiveStyleSheet("theme1");
   }
   else if(sheet=="two"){
   setActiveStyleSheet("theme2");
   }
   else if(sheet=="three"){
   setActiveStyleSheet("theme3");
   }
   else{
   setActiveStyleSheet("default");
   }
   return false
};*/