/* 
 * A person is a wrapper around the ThreeJS Mesh object.
 * It exists on a 2D plane on the X and Z axis.
 */

let personGeometry = new THREE.SphereGeometry(1, 32, 32);
let personMaterial = new THREE.MeshBasicMaterial( {color: 0x42a4f4} );
const personSize = 1;

class Person {
  constructor(coordHorizontal, coordVertical, alias, pid) {
    this.alias = alias;
    this.coordHorizontal = coordHorizontal;
    this.coordVertical = coordVertical;
    this.pid = pid;

    this.meshObject = new THREE.Mesh(personGeometry, personMaterial);
    this.meshObject.position.set(this.coordHorizontal, 1, this.coordVertical);
    this.meshObject.name = pid;
  }

  setPosition(updatedHorizontal, updatedVertical) {
    this.coordHorizontal = updatedHorizontal;
    this.coordVertical = updatedVertical;
    this.meshObject.position.set(this.coordHorizontal, 1, this.coordVertical);
  }

  setPid(pid) {
    this.meshObject.name = pid;
  }
}