function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

//Click-to-copy share URL
document.getElementById("copyButton").addEventListener("click", function () {
    document.getElementById('shareLinkTextbox').select();
    document.execCommand('copy');
    toastClipboardCopied();
});

/* jQuery Toasts */
function toastClipboardCopied() {
    toastr.success("Copied to clipboard!");
}
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

function toastSaveSuccess() {
    toastr.success("Your blocking was saved!");
}

function toastNotLoggedIn() {
    toastr.error("You must be logged in to perform this action");
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

function convertDtoToFormations(blockingData) {
    var convertedFormations = blockingData['formations'];
    var formationsToUse;
    var personsToUse;

    for (i = 0; i < convertedFormations.length; i++) {

    }

    formations
    personArray = formations[0];
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

/* Dirty check to validate the pushId translates to a Unix timestamp that must exist */
function validatePushId(pushId) {
    var current = Math.round((new Date()).getTime() / 1000);
    var past = 1504072000;

    var checked = getTimestampFromId(pushId);
    if (pushId > past && pushId <= current) {
        return true;
    } else {
        return false;
    }
}

/* Convert a pushId to a Unix timestamp */
// Source: https://gist.github.com/svincent/ae4eead8f7a97620e963/bfdf1a3deb13192cc2835d296b78c7076d29dacb
var getTimestampFromId = (function () {
    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';

    return function getTime(id) {
        return id.substr(0, 8)              // Only the first 8 bytes are deterministic
            .split('')                        // We're going to operate on each index and combine the result
            .map(function (cur) {               // Convert each character to it's numeric value
                return PUSH_CHARS.indexOf(cur);
            })
            .reduce(function (prev, cur) {      // Combine all numeric values into a single integer (timestamp)
                return prev * 64 + cur;
            });
    }
})();