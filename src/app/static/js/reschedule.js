var datesSelection = document.getElementById("date-input"); // date selection input
var availablePtag = document.getElementById("avail-dates"); // the p tag which displays the date selected
var dateText = document.createElement("p");
var timebox = document.getElementById("timebox");
var appointment = document.getElementById("appointment");
var token = localStorage.getItem("token");
if(!token){
    window.location.href = 'login.html';
}
else {
    var decoded = parseJwt(token);
}
    if(decoded.isBarber){
        appointment.textContent = "Select a new date and time for " + sessionStorage.getItem("user") + "'s appointment";
    }else{
        appointment.textContent = "Please select a new date for your " + sessionStorage.getItem("service") + " with " + sessionStorage.getItem("barbername");
    }


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
    // if selected date is in the past, display error message
    if (new Date(fixDate(date)) < new Date()) {
        dateText.innerHTML = "Please select a date in the future";
        availablePtag.appendChild(dateText);
        return;
    }
    let barberid = sessionStorage.getItem("barberid");
    
    unavailAppointments = [];
    console.log(barberid);
    if(barberid == "")
        console.log("barberid is empty");
    await fetch('/api/v1/appointments?barberid=' + barberid + '&date=' + fixDate(date),{
        method: 'GET'})
    .then(response => response.json())
    .then(data => {
        if(data["message"]) {
            dateText.innerHTML = "No appointments today, " + data["message"];
            // remove all children from timebox
            while (timebox.firstChild) {
                timebox.removeChild(timebox.firstChild);
            }
            return;
        }
        console.log(data);
        for (var i = 0; i < data.length; i++) {
            unavailAppointments.push(data[i]["time"]);
        }
        console.log(unavailAppointments);
        if(!timebox.hasChildNodes()){
            for (let i = 0; i < 15; i++) {
                var timebox_item = document.createElement("button");
                timebox_item.classList.add("timebox-item");
                timebox_item.innerHTML = availTimes[i];
                // add event listener to each timebox item
                timebox_item.addEventListener("click", function(event) {
                    choose_time_main(event.target.innerHTML);
                })
                timebox.appendChild(timebox_item);
                if (unavailAppointments.includes(availTimes[i])) {
                    timebox_item.disabled = true;
                };
        
            }
        }
    });
}


function choose_time_main(time) {
    data = {
        "date": datesSelection.value,
        "time": time,
        "needsRescheduling": false
    }
    fetch('/api/v1/appointments/' + sessionStorage.getItem("appointment"), {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data["message"]) {
            alert(data["message"]);
        }
        else {
            sessionStorage.removeItem("appointment");
            sessionStorage.removeItem("barberid");
            sessionStorage.removeItem("service");
            sessionStorage.removeItem("barbername");
            sessionStorage.removeItem("user");
            if(decoded.isBarber)
                window.location.href = 'barber_dashboard.html';
            else
                window.location.href = 'history.html';
        }
    });
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};