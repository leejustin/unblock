var personArray = [];

class Person extends THREE.Mesh {
    constructor(coordHorizontal, coordVertical, alias) {
        var personGeometry = new THREE.SphereGeometry((1 * SCALE_FACTOR), 32, 32);
        var personMaterial = new THREE.MeshBasicMaterial({ color: 0x42a4f4 });

        super(personGeometry, personMaterial);
        this.alias = alias;
        this.position.set(coordHorizontal, (1 * SCALE_FACTOR), coordVertical);
    }
}

/* Creates a deep copy of the given array of Persons */
function clonePersonArray(personArrayToClone) {
    var clonedArray = new Array();

    for (var i = 0; i < personArrayToClone.length; i++) {
        var currentPerson = personArrayToClone[i];

        var oldCoordHorizontal = currentPerson.position.x;
        var oldCoordVertical = currentPerson.position.z;
        var oldAlias = currentPerson.alias;

        var copiedPerson = new Person(oldCoordHorizontal, oldCoordVertical, oldAlias);
        clonedArray.push(copiedPerson);
    }
    return clonedArray;
}

/* Redraws the entire board with person objects -- board should be cleared first */
function initializePersons() {
    console.log("HERE ARE THE FORMATIONS");
    console.log(formations);
    if (formations.length < 1) {
        formations.push(personArray);
    }
    for (person of personArray) {
        scene.add(person);
    }
}

/* Hides the stage of all person objects */
function hideAllPersons() {
    objectTransformControl.detach();

    for (person of personArray) {
        scene.remove(person);
    }
}

/* Removes every person from the entire stage */
function removeAllPersons() {
    for (i = personArray.length - 1; i >= 0; i--) {
        removePerson(personArray[i].id);
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
                personArray.splice(i, 1);
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
    toastClearAll();
    toastPersonCreated(String(personArray.length));
}

/* Return the id of the person with the object transform */
function getSelectedPerson() {
    try {
        return objectTransformControl.object.id;
    } catch (e) {
        return;
    }
}