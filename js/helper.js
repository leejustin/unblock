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

function createBlockingDto(formations, width, length, userId) {
    return {
        'formations': formations,
        'dimension': {
            'width': width,
            'length': length,
        },
        'createdBy': userId,
        'createdAt': null
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

