var datesSelection = document.getElementById("date-input"); // date selection input
var availablePtag = document.getElementById("avail-dates"); // the p tag which displays the date selected
var dateText = document.createElement("p");

var table = document.getElementById("calendar-table");
var tablehead = document.getElementById("table-head");
var tablebody = document.getElementById("table-body");

// allData is a string
var allData


datesSelection.addEventListener("change" , function() {
    getAppointments();
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
dateText.innerHTML = "Your schedule for today";
availablePtag.appendChild(dateText);
getAppointments();


 // add button to the bottom which runs the function TakeSickDay
 var sickDayButton = document.getElementById("sick-day");
 sickDayButton.addEventListener("click", function(event) {
     takeSickDay();
 });



function getAppointments(){
    let barberid = localStorage.getItem("barberid");
    fetch('/api/v1/appointments?barberid=' + barberid + '&date=' + datesSelection.value,{
        method: 'GET'})
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if(data["message"]) {
            // remove all children from timebox
            while (tablebody.firstChild) {
                tablebody.removeChild(tablebody.firstChild);
            }
            if(data["message"] == "barber is unavailable") 
                dateText.innerHTML = "No appointments today, You took a day off";
            else
                dateText.innerHTML = "No appointments today, " + data["message"];
        } else {
            var date = fixDate(datesSelection.value);
            dateText.innerHTML = "";
            
            if (!isNaN(date[0])) { // If a valid date is selected, the site displays the date in a p tag
                // if date is today display "Today"
                if (new Date(fixDate(date)).toDateString() == new Date().toDateString()) {
                    dateText.innerHTML = "Your schedule for today";
                }
                else {
                    dateText.innerHTML = "Your schedule for the date: " + date
                    availablePtag.appendChild(dateText);
                }

                allData = data
                populateTable(data);
            }
        }   
    })
}

function populateTable(input) {

    tablehead.innerHTML = "";
    tablebody.innerHTML = "";

    var selectedDate = new Date(datesSelection.value);


    var todayDate = new Date();

    var time = document.createElement("th");
    var type = document.createElement("th");
    var name = document.createElement("th");
    var price = document.createElement("th");

    time.classList.add("table-header");
    type.classList.add("table-header");
    name.classList.add("table-header");
    price.classList.add("table-header");

    time.innerHTML = "Time";
    type.innerHTML = "Service";
    name.innerHTML = "Client";
    price.innerHTML = "Price";

    tablehead.appendChild(time);
    tablehead.appendChild(type);
    tablehead.appendChild(name);
    tablehead.appendChild(price);

    // If date is in future, we have cancel button
    if (selectedDate >= todayDate) {
        var cancel = document.createElement("th");
        cancel.classList.add("table-header")
        cancel.style.width = "210px";
        cancel.innerHTML = "Options";
        tablehead.appendChild(cancel);
    }

    for (var i = 0; i < input.length; i++) {

        var row = document.createElement("tr");
        row.id = input[i]["_id"];
        var appoint_time = document.createElement("th");
        var appoint_type = document.createElement("td");
        var appoint_name = document.createElement("td");
        var appoint_price = document.createElement("td");

        

        appoint_time.innerHTML = input[i].time;
        appoint_type.innerHTML = input[i].service.split(",")[0];
        appoint_name.innerHTML = input[i].user;
        appoint_price.innerHTML = input[i].service.split(",")[1] + " kr";

        row.appendChild(appoint_time);
        row.appendChild(appoint_type);
        row.appendChild(appoint_name);
        row.appendChild(appoint_price);

        if (selectedDate >= todayDate && !input[i].cancelled) {
            var buttons = document.createElement("td");
            var cancel_btn = document.createElement("button");
            cancel_btn.classList.add("btn");
            cancel_btn.classList.add("btn-primary");
            cancel_btn.innerHTML = "Cancel";
            // add event listener to cancel button
            cancel_btn.addEventListener("click", function() {
                var appointmentid = this.parentNode.parentNode.id;
                cancelAppointment(appointmentid);
            });
            buttons.appendChild(cancel_btn);
            
            
            var reschedule_btn = document.createElement("button");
            reschedule_btn.classList.add("btn");
            reschedule_btn.classList.add("btn-primary");
            reschedule_btn.style.marginLeft = "10px";
            reschedule_btn.innerHTML = "Reschedule";
            console.log(reschedule_btn);
            // add event listener to reschedule button use input[i]
            reschedule_btn.addEventListener("click", function() {
                var appointmentid = this.parentNode.parentNode.id;
                rescheduleAppointment(appointmentid);
            },false
            );
            buttons.appendChild(reschedule_btn);
            row.appendChild(buttons);

        }
        if(input[i].cancelled) {
            var cancelled = document.createElement("td");
            cancelled.innerHTML = "Cancelled";
            row.appendChild(cancelled);
        }
        if(input[i].cancelled) {
            row.style.backgroundColor = "#EEEEEE"
        }
        tablebody.appendChild(row);
    }

}

function cancelAppointment(id) {
    fetch('/api/v1/appointments/' + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cancelled: true }) 
    })
    .then(response => response.json())
    .then(data => {
        // remove row from table
        var row = document.getElementById(id);
        row.style.backgroundColor = "#EEEEEE";

})
}


function rescheduleAppointment(idname) {
    //  implement page to find new time and date
    // that page should send a request with the following format:
    // {needsRescheduling:false, date: newdate, time: newtime}

    allData.forEach((appointment) => {
        if(appointment._id == idname) {
            sessionStorage.setItem("appointment", appointment._id);
            sessionStorage.setItem("barberid", appointment.barberid);
            sessionStorage.setItem("service", appointment.service.split(",")[0]);
            sessionStorage.setItem("barbername", appointment.barber);
            sessionStorage.setItem("user",appointment. user);
        }
    })
            

    window.location.href = "/reschedule.html";
}


function takeSickDay() {
    sickDayButton.disabled = true;
    fetch('/api/v1/holiday', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({ date: datesSelection.value })
    })
}
