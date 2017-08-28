function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

//Click-to-copy share URL
document.getElementById("copyButton").addEventListener("click", function () {
    document.getElementById('shareLinkTextbox').select();
    document.execCommand('copy');
});

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

/* Used to grab URL params
 * Source: sitepoint.com/get-url-parameters-with-javascript
 * 
 * Once this is moved to a proper framework we should get rid of this because it's stupid to hack this in 2017 
 */
function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    // we'll store the parameters here
    var obj = {};
    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // in case params look like: list[]=thing1&list[]=thing2
            var paramNum = undefined;
            var paramName = a[0].replace(/\[\d*\]/, function (v) {
                paramNum = v.slice(1, -1);
                return '';
            });

            // set parameter value (use 'true' if empty)
            var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

            // if parameter name already exists
            if (obj[paramName]) {
                // convert value to array (if still string)
                if (typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                }
                // if no array index number specified...
                if (typeof paramNum === 'undefined') {
                    // put the value on the end of the array
                    obj[paramName].push(paramValue);
                }
                // if array index number specified...
                else {
                    // put the value at that index number
                    obj[paramName][paramNum] = paramValue;
                }
            }
            // if param name doesn't exist yet, set it
            else {
                obj[paramName] = paramValue;
            }
        }
    }

    return obj;
}