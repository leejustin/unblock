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