var formations = [];
var activeFormation = 0;

/* Set the current formation to a new or existing one.  Return the index of the newly-created formation */
function createAndSetFormation(formationIndex = null, formationsToUse = formations) {
    var personArrayToUse;

    if (formationIndex != null && formationIndex < formationsToUse.length) {
        personArrayToUse = clonePersonArray(formationsToUse[formationIndex]);
        //console.log(personArrayToUse);
    } else {
        //personArrayToUse = new Array();
        personArrayToUse = clonePersonArray(formationsToUse[activeFormation]);
    }

    formations.push(personArrayToUse);
    var createdFormationIndex = formations.length - 1;

    activeFormation = createdFormationIndex;

    addOptionToSelectList(createdFormationIndex);
    setFormation(createdFormationIndex);

    toastFormationCreated();

    return createdFormationIndex;
}

function setFormation(formationIndex) {
    toastClearAll();
    hideAllPersons();

    personArray = formations[formationIndex];
    activeFormation = formationIndex * 1;

    changeFormationSelectList(formationIndex);
    initializePersons();
}

/* UI update synchronize the select menu with the formation array */
function updateFormationList() {
    var option = "";

    for (var i = 0; i < formations.length; i++) {
        option += "<option value='" + i + "'>Formation " + (i + 1) + "</option>";
    }
    $("#formation-list").empty().append(option).val(formations.length - 1).selectpicker("refresh");
}

/* UI update the select menu with the given index */
function changeFormationSelectList(formationIndex) {
    $("#formation-list").val(formationIndex);
    $("#formation-list").selectpicker("refresh");
}

/* UI update add an option to the select menu for a new formation */
function addOptionToSelectList(formationIndex) {
    var option = "<option value ='" + formationIndex + "'>Formation " + (formationIndex + 1) + "</option>";
    $("#formation-list").append(option).selectpicker("refresh");
}

/* Set the formation to the one that is selected from the UI */
document.getElementById("formation-list").onchange = function () {
    var formationIndex = document.getElementById("formation-list").value;

    //Index can't be something outside of array length
    if (formationIndex < formations.length) {
        console.log("change formation to: " + formationIndex);
        setFormation(formationIndex);
    } else {
        return false
    }
};

/* Make a remote call to get the formations, parse it, and set it to the stage */
// This is way too messy and manual data-rebinding and UI workarounds. Shows why raw jQuery is not the biz.
function parseAndSetBlockingData(blockingData) {
    var formationsToUse = parseBlockingFormationData(blockingData['formations']);

    //Remove and replace the existing one
    removeAllPersons();
    formations = [];
    formations.push(formationsToUse[0]);
    personArray = formations[0];

    //Initialize each of the formations
    for (i = 1; i < formationsToUse.length; i++) {
        createAndSetFormation(i, formationsToUse);
    }

    //Set the formation to the first one
    setFormation(0);
}

/* Turn the remote JSON data into the same array format that we use for our formations */
function parseBlockingFormationData(formationData) {
    var formationsToUse = [];
    
    for (i = 0; i < formationData.length; i ++) {
        var personArrayToUse = [];
        if (formationData[i] != null) { //Empty gets stored as undefined in DB instead of empty array
            for (j = 0; j < formationData[i].length; j++) {
                var horiz = formationData[i][j]['position']['x'] * SCALE_FACTOR;
                var vert = formationData[i][j]['position']['z'] * SCALE_FACTOR;
                var alias = formationData[i][j]['alias'];

                personArrayToUse.push(new Person(horiz, vert, alias));
            }
        } else {
            personArrayToUse = [];
        }
        formationsToUse.push(personArrayToUse);
    }
    return formationsToUse;
}