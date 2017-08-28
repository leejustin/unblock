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
                $('#logoutButton').attr('style','display: visible');
                $('#loginButton').attr('style','display: none');
            });
        } else {
            // User is signed out.
            $('#logoutButton').attr('style','display: none');
            $('#loginButton').attr('style','display: visible');
        }
    }, function (error) {
        console.log(error);
    });
};

window.addEventListener('load', function () {
    initApp()
});

