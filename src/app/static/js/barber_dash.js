var datesSelection = document.getElementById("date-input"); // date selection input
var availablePtag = document.getElementById("avail-dates"); // the p tag which displays the date selected
var dateText = document.createElement("p");

var table = document.getElementById("calendar-table");
var tablehead = document.getElementById("table-head");
var tablebody = document.getElementById("table-body");

var testinput = ["9:00,Haircut,Otto,5.999 kr", "9:30,Shave,John,2.999 kr", "10:00,Colouring,Paul,10.999 kr", "10:30,Haircut,Abcd,5.999 kr"];
var testinput2 = ["9:30,Shave,John,59.999 kr", "13:30,Haircut,John,20.999 kr", "15:00,Colouring,Paul,10.999 kr"];

datesSelection.addEventListener("change" , function() {
    var date = fixDate(datesSelection.value);
    dateText.innerHTML = "";
    
    if (!isNaN(date[0])) { // If a valid date is selected, the site displays the date in a p tag
        dateText.innerHTML = "Your schedule for the date: " + date
        availablePtag.appendChild(dateText);

        populateTable(testinput2);
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
    tablehead.innerHTML = "";
    tablebody.innerHTML = "";


    var selectedDate = datesSelection.value;

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    var todayDate = yyyy + '-' + mm + '-' + dd;

    console.log(selectedDate);
    console.log(todayDate);
    console.log(selectedDate >= todayDate);

    var time = document.createElement("th");
    var type = document.createElement("th");
    var name = document.createElement("th");
    var price = document.createElement("th");

    time.classList.add("table-header");
    type.classList.add("table-header");
    name.classList.add("table-header");
    price.classList.add("table-header");

    time.innerHTML = "Time";
    type.innerHTML = "Type";
    name.innerHTML = "Name";
    price.innerHTML = "Price";

    tablehead.appendChild(time);
    tablehead.appendChild(type);
    tablehead.appendChild(name);
    tablehead.appendChild(price);

    // If date is in future, we have cancel button
    if (selectedDate >= todayDate) {
        var cancel = document.createElement("th");
        cancel.classList.add("table-header")
        cancel.innerHTML = "Cancel";
        tablehead.appendChild(cancel);
    }

    for (var i = 0; i < testinput.length; i++) {
        var input = testinput[i].split(",");

        var row = document.createElement("tr");
        var appoint_time = document.createElement("th");
        var appoint_type = document.createElement("td");
        var appoint_name = document.createElement("td");
        var appoint_price = document.createElement("td");

        appoint_time.innerHTML = input[0];
        appoint_type.innerHTML = input[1];
        appoint_name.innerHTML = input[2];
        appoint_price.innerHTML = input[3];

        row.appendChild(appoint_time);
        row.appendChild(appoint_type);
        row.appendChild(appoint_name);
        row.appendChild(appoint_price);

        if (selectedDate >= todayDate) {
            var cancel_btn_cell = document.createElement("td");
            var cancel_btn = document.createElement("button");
            cancel_btn.classList.add("btn");
            cancel_btn.classList.add("btn-primary");
            cancel_btn.innerHTML = "Cancel";
            cancel_btn_cell.appendChild(cancel_btn);
            row.appendChild(cancel_btn_cell);
        }

        tablebody.appendChild(row);
    }

}

populateTable(testinput);
