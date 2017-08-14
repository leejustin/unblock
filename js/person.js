class Person extends THREE.Mesh {
    constructor(coordHorizontal, coordVertical, alias) {
        var personGeometry = new THREE.SphereGeometry(1, 32, 32);
        var personMaterial = new THREE.MeshBasicMaterial({ color: 0x42a4f4 });

        super(personGeometry, personMaterial);
        this.alias = alias;
        this.position.set(coordHorizontal, 1, coordVertical);
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
