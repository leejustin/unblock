var formations = [];

/* Set the current formation to a new or existing one.  Return the index of the newly-created formation */
function createAndSetFormation(formationIndex = null) {
    var personArrayToUse;

    if (formationIndex != null && formationIndex < formations.length) {
        personArrayToUse = clonePersonArray(formations[formationIndex]);
        //console.log(personArrayToUse);
    } else {
        personArrayToUse = new Array();
    }

    formations.push(personArrayToUse);
    var createdFormationIndex = formations.length - 1;
    console.log("Created formation at index: " + createdFormationIndex);

    addOptionToSelectList(createdFormationIndex);
    setFormation(createdFormationIndex);
    return createdFormationIndex;
}

function setFormation(formationIndex) {
    removeAllPersons();
    personArray = formations[formationIndex];
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