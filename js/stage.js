/* 
 * A stage is conceptually the 2D plane where objects 
 * (such as persons) are placed. 
 */

var gridHelper;
var stageMesh;

var gridHelperIsVisible;
var stageMeshIsVisible;

var isAudienceView = false;

let SCALE_FACTOR = 8;

//Coordinates where a person will spawn
let spawnPersonHorizontal = -12 * SCALE_FACTOR;
let spawnPersonVertical = -12 * SCALE_FACTOR;

let stageSize = 80 * SCALE_FACTOR;

function initializeStageGrid() {
    gridHelper = new THREE.GridHelper(stageSize, stageSize / (2 * SCALE_FACTOR));
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
    var maxAnisotropy = renderer.getMaxAnisotropy();

    var loader = new THREE.TextureLoader();
    loader.crossOrigin = "res.cloudinary.com";

    loader.load(
        'http://res.cloudinary.com/dxxrfg2kn/image/upload/v1503283060/hardwood-smaller_mwa2il.jpg',
        function (texture) {
            var material = new THREE.MeshBasicMaterial({ map: texture });

            texture.anisotropy = maxAnisotropy;
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set(1, stageSize/SCALE_FACTOR); //Creates the floorboard design

            var geometry = new THREE.PlaneGeometry(stageSize, stageSize);

            stageMesh = new THREE.Mesh(geometry, material);
            stageMesh.rotation.x = - Math.PI / 2;
            //mesh1.scale.set( 2, 2, 2 );
            stageMeshIsVisible = true;
            scene.add(stageMesh);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (xhr) {
            console.log('An error happened');
        }
    );
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