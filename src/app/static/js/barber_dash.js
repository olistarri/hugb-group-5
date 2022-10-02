var datesSelection = document.getElementById("date-input"); // date selection input
var availablePtag = document.getElementById("avail-dates"); // the p tag which displays the date selected
var dateText = document.createElement("p");

var table = document.getElementById("calendar-table");

var testinput = ["9:00,Haircut,Otto,5.999 kr", "9:30,Shave,John,2.999 kr", "10:00,Colouring,Paul,10.999 kr", "10:30,Haircut,Abcd,5.999 kr"];


datesSelection.addEventListener("change" , function() {
    var date = fixDate(datesSelection.value);
    dateText.innerHTML = "";
    
    if (!isNaN(date[0])) { // If a valid date is selected, the site displays the date in a p tag
        dateText.innerHTML = "Your schedule for the date: " + date
        availablePtag.appendChild(dateText);
    }
})

function fixDate(date) {
    var date = date.split("-");
    date = date[2] + "-" + date[1] + "-" + date[0];
    return date
}

// Set the starting date value as today
Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});
datesSelection.value = new Date().toDateInputValue();
dateText.innerHTML = "Your schedule for the date: " + fixDate(datesSelection.value);
availablePtag.appendChild(dateText);


function populateTable(input) {
    var selectedDate = datesSelection.value;
    var todayDate = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()

    console.log(selectedDate);
    console.log(todayDate);

    console.log(todayDate >= selectedDate);



    // for (var i = 0; i < testinput.length(); i++) {

    // }
}

populateTable(testinput);