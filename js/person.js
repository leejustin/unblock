class Person extends THREE.Mesh {
    constructor(coordHorizontal, coordVertical, alias, pid) {
        var personGeometry = new THREE.SphereGeometry(1, 32, 32);
        var personMaterial = new THREE.MeshBasicMaterial({ color: 0x42a4f4 });
    
        super(personGeometry, personMaterial);
        this.alias = alias;

        this.position.set(coordHorizontal, 1, coordVertical);
        this.name = pid;
    }
}