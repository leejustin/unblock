initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var uid = user.uid;
            var phoneNumber = user.phoneNumber;
            var providerData = user.providerData;
            user.getIdToken().then(function (accessToken) {
                $('#logoutCol').attr('style','display: visible');
                $('#loginCol').attr('style','display: none');
            });
        } else {
            // User is signed out.
            $('#logoutCol').attr('style','display: none');
            $('#loginCol').attr('style','display: visible');
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});

function updateShareLinkTextbox(bid) {
    var baseUrl = window.location.href.split('?')[0];
    $('#shareLinkTextbox').val(baseUrl + "?bid=" + bid);
}

/* Retrieve and set the global variable for blocking id from the url params */
function setBlockingId() {
    var params = getAllUrlParams()
    if (params.bid == null) {
        BLOCKING_ID = null;
    } else {
        BLOCKING_ID = params.bid;
    }
}

function blockingIdExists() {
    if (BLOCKING_ID == null) {
        return false;
    } else {
        return true;
    }
}