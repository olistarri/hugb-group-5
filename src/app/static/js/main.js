var datesSelection = document.getElementById("date-input"); // date selection input
var availablePtag = document.getElementById("avail-dates"); // the p tag which displays the date selected
var dateText = document.createElement("p");
var timebox = document.getElementById("timebox");

var availTimes = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", 
                "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"];

datesSelection.addEventListener("change" , function() {
    var date = fixDate(datesSelection.value);
    dateText.innerHTML = "";
    timebox.innerHTML = "";
    
    if (!isNaN(date[0])) { // If a valid date is selected, the site displays the date in a p tag
        dateText.innerHTML = "All available times for the date: " + date
        availablePtag.appendChild(dateText);
        populateDateBox(date);
    }
})

function fixDate(date) {
    var date = date.split("-");
    date = date[2] + "-" + date[1] + "-" + date[0];
    return date
}

async function populateDateBox(date) {
    barberid = sessionStorage.getItem("barber");
    unavailAppointments = [];
    console.log(date);
    await fetch('/api/v1/appointments?barberid=' + barberid + '&date=' + fixDate(date),{
        method: 'GET'})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            unavailAppointments.push(data[i]["time"]);
        }
        console.log(unavailAppointments);
        for (let i = 0; i < 15; i++) {
            var timebox_item = document.createElement("button");
            timebox_item.classList.add("timebox-item");
            timebox_item.innerHTML = availTimes[i];
            timebox.appendChild(timebox_item);
            if (unavailAppointments.includes(availTimes[i])) {
                timebox_item.disabled = true;
            };
    
   
        }
    });
}