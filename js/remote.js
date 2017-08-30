function initLogin() {
    // FirebaseUI config.
    var uiConfig = {
        signInOptions: [
            // Leave the lines as is for the providers you want to offer your users.
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        tosUrl: '',
        signInFlow: 'popup',
        callbacks: {
            signInSuccess: function (currentUser, credential, redirectUrl) {
                $('#signInModal').modal('hide');
                toastSignedIn();
                return false;
            },
            uiShown: function () {
            }
        }
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);
}

function initDatabase() {
    var config = {
        apiKey: "AIzaSyDx60olv62NlQKn5XONx7HQbR4_Y1DHuA0",
        authDomain: "blockthis-178103.firebaseapp.com",
        databaseURL: "https://blockthis-178103.firebaseio.com",
        projectId: "blockthis-178103",
        storageBucket: "blockthis-178103.appspot.com",
        messagingSenderId: "109334240835"
    };
    firebase.initializeApp(config);
}

function writeNewBlockingData(data) {
    var postRef = firebase.database()
        .ref('blocking/')
        .push(data)
        .then(function (snapshot) {
            console.log("stored with key: " + snapshot.key);
            updateShareLinkTextbox(snapshot.key);
            BLOCKING_ID = snapshot.key;
        });
}

function updateBlockingData(data, key) {
    var postRef = firebase.database()
        .ref('blocking/' + key)
        .set(data)
        .then(function (snapshot) {
            console.log("updated for key: " + key);
            updateShareLinkTextbox(key);
        });
}

/* TODO: This also sets the blocking ID which shouldn't happen in a service layer */
function retrieveBlockingData(id) {
    var postRef = firebase.database()
        .ref('/blocking/' + id)
        .once('value')
        .then(function (snapshot) {
            console.log("retrieved:");
            console.log(snapshot.val());
            parseAndSetBlockingData(snapshot.val());
            BLOCKING_ID = id;
        });
}

function signOut() {
    firebase.auth().signOut();
}

/* Called to actually write the data to DB */
function saveFormationHandler() {
    var user = firebase.auth().currentUser;
    
    if (user) {
        var userId = user.uid;
        createAndStoreBlockingData("todoTempName", formations, stageSize, stageSize, userId);
        toastSaveSuccess();
    } else {
        //TODO
        console.log("user is not logged in");
        toastNotLoggedIn();
    }
}

/* Store blocking data accordingly */
function createAndStoreBlockingData(name, formations, width, length, userId) {
    var convertedFormations = convertFormationsToDto(formations);
    console.log(convertedFormations);
    var convertedBlocking = createBlockingDto(name, convertedFormations, (width / SCALE_FACTOR), (length / SCALE_FACTOR), userId);
    console.log(convertedBlocking);
    
    var response;
    if (blockingIdExists()) {
        updateBlockingData(convertedBlocking, BLOCKING_ID);
    } else {
        writeNewBlockingData(convertedBlocking);
    }
    return response;
}