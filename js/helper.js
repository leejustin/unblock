function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

/* jQuery Toasts */
function toastFormationCreated() {
    toastr.success("New formation created!");
}

function toastPersonCreated(id) {
    toastr.success("Person " + id + " created!");
}

function toastClearAll() {
    toastr.remove();
}

function toastSignedIn() {
    var username = firebase.auth().currentUser.displayName;
    if (username != null && username != "") {
        toastr.success("Hello, " + username + "!");
    }
    toastr.success("You are now signed in!");
}

//TODO: This should go in a controller
function signOutAndToast() {
    signOut();
    toastr.info("You are now signed out");
}

/* Convert to JSON for DB */
function createPersonDto(alias, x, y, z) {
    return {
        'alias': alias,
        'position': {
            'x': x,
            'y': y,
            'z': z
        },
        'state': 'default',
        'type': 'sphere'
    }
}

function createBlockingDto(name, formations, width, length, userId) {
    return {
        'name': name,
        'formations': formations,
        'dimension': {
            'width': width,
            'length': length,
        },
        'createdBy': userId,
        'createdAt': firebase.database.ServerValue.TIMESTAMP
    }
}

function convertFormationsToDto(formations) {
    var convertedFormations = [];

    for (i = 0; i < formations.length; i++) {
        var convertedPersons = [];
        for (j = 0; j < formations[i].length; j++) {
            convertedPersons.push(
                createPersonDto(formations[i][j]['alias'],
                    formations[i][j]['position']['x'] / SCALE_FACTOR,
                    formations[i][j]['position']['y'] / SCALE_FACTOR,
                    formations[i][j]['position']['z'] / SCALE_FACTOR));
        }
        convertedFormations.push(convertedPersons);
    }

    return convertedFormations;
}

function createAndStoreBlockingData(name, formations, width, length, userId) {
    var convertedFormations = convertFormationsToDto(formations);
    console.log(convertedFormations);
    var convertedBlocking = createBlockingDto(name, convertedFormations, (width / SCALE_FACTOR), (length / SCALE_FACTOR), userId);
    console.log(convertedBlocking);
    return response = writeBlockingData(convertedBlocking);
}

