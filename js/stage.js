/* 
 * A stage is conceptually the 2D plane where objects 
 * (such as persons) are placed. 
 */

var gridHelper;
var stageMesh;

var gridHelperIsVisible;
var stageMeshIsVisible;

var isAudienceView = false;

//Coordinates where a person will spawn
let spawnPersonHorizontal = -12;
let spawnPersonVertical = -12;

let stageSize = 40;

function initializeStageGrid() {
    gridHelper = new THREE.GridHelper(stageSize, stageSize / 2);
    //gridHelper.position.y = 1;
    gridHelperIsVisible = false;
    //scene.add(gridHelper);
}

function toggleStageGrid() {
    if (gridHelperIsVisible) {
        scene.remove(gridHelper);
    } else {
        scene.add(gridHelper);
    }

    gridHelperIsVisible = !gridHelperIsVisible;
}

function initializeStageMaterial() {
    var textureLoader = new THREE.TextureLoader();
    var maxAnisotropy = renderer.getMaxAnisotropy();

    //var texture = textureLoader.load("assets/texture/hardwood-smaller.jpg");
    var texture = new THREE.Texture();
    texture.image = hardwood_smaller_image;
    hardwood_smaller_image.onload = function() {
	    texture.needsUpdate = true;
    };
    var material = new THREE.MeshBasicMaterial({ map: texture });

    texture.anisotropy = maxAnisotropy;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 40); //Creates the floorboard design

    var geometry = new THREE.PlaneGeometry(stageSize, stageSize);

    stageMesh = new THREE.Mesh(geometry, material);
    stageMesh.rotation.x = - Math.PI / 2;
    //mesh1.scale.set( 2, 2, 2 );
    stageMeshIsVisible = true;
    scene.add(stageMesh);
}

function toggleStageMesh() {
    if (stageMeshIsVisible) {
        scene.remove(stageMesh);
    } else {
        scene.add(stageMesh);
    }

    stageMeshIsVisible = !stageMeshIsVisible;
}

/* This will toggle both meshes. It's up to your implementation to keep track of the states */
function toggleStageMeshAndGrid() {
    toggleStageMesh();
    toggleStageGrid();
}

function toggleAudienceView() {
    var CAMERA;
    if (isAudienceView) {
        CAMERA = CAMERA_BIRD;
    } else {
        CAMERA = CAMERA_STAGE;
    }

    isAudienceView = !isAudienceView;

    camera.position.set(CAMERA.zoomX, CAMERA.zoomY, CAMERA.zoomZ);
    camera.lookAt(scene.position);
}