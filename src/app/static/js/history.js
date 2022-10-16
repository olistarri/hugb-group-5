// populate main-div with my appointments
function history(){
    if (!localStorage.getItem("token") || !localStorage.getItem("userid")) {
        window.location.href = "/login.html";
        return;
    }

    fetch("/api/v1/appointments?userid="+localStorage.getItem('userid'), {
        // query parameter for user id
        method: "GET",
        headers: {"Content-Type": "application/json"},
        })
    .then(response => response.json())
    .then(data => {
        var main_div = document.getElementById("main-div");
        for (var i = 0; i < data.length; i++) {
            var appointments = data[i];
            const appointmentpassed = new Date(appointments["date"] + " " + appointments["time"]) < new Date();
            var div = document.createElement("div");
            div.className = "col";
            var div_card = document.createElement("div");
            div_card.className = "card mb-4 rounded-3 shadow-sm";
            var div_card_header = document.createElement("div");
            div_card_header.className = "card-header py-3";
            var h4 = document.createElement("h4");
            h4.className = "my-0 fw-normal";
            h4.innerHTML = appointments["barber"];
            div_card_header.appendChild(h4);
            var div_card_body = document.createElement("div");
            div_card_body.className = "card-body";
            var ul = document.createElement("ul");
            ul.className = "list-unstyled mt-3 mb-4";
            var serv = document.createElement("serv");
            var price = document.createElement("serv");
            var d = document.createElement("d");
            var t = document.createElement("t");
            linebreak_1 = document.createElement("br");
            linebreak_2 = document.createElement("br");
            linebreak_3 = document.createElement("br");
            var service_string = appointments["service"].split(",");
            serv.innerHTML = "Service: " + service_string[0];
            price.innerHTML = "Price: " + service_string[1] + " kr";
            d.innerHTML = "Date: " + new Date(appointments["date"]).toString().split(' ').slice(0,4).join(' ');
            t.innerHTML = " Time: " + appointments["time"];
            if(appointments.needsRescheduling){
                var notice = document.createElement("p");
                notice.innerHTML = "Needs rescheduling";
                notice.style.fontWeight = "bold";
                notice.style.color = "red";
                div_card_body.appendChild(notice);
            }
            ul.appendChild(serv);
            ul.appendChild(linebreak_1);
            ul.appendChild(price);
            ul.appendChild(linebreak_2);
            ul.appendChild(d);
            ul.appendChild(linebreak_3);
            ul.appendChild(t);
            div_card_body.appendChild(ul);

            // ---------- Calculating difference until date
            var today = new Date();
            var Difference_In_Time = (new Date(appointments["date"]).getTime() - today.getTime() ) / (1000*60*60*24);
            if (Difference_In_Time > -1) {
                var days_until_element = document.createElement("days_until_element");
                days_until_element.innerHTML = 'Days until appointment: ' + Math.round(Difference_In_Time);
                days_until_element.style.fontWeight = "bold";
                div_card_body.appendChild(days_until_element);
                linebreak_days_until = document.createElement("br");
                div_card_body.appendChild(linebreak_days_until);

            }

            if(appointmentpassed){
                var passed_element = document.createElement("passed_element");
                passed_element.innerHTML = "Passed";
                passed_element.style.fontWeight = "bold";
                div_card_body.appendChild(passed_element);
            }
            else if(!appointments["cancelled"] && !appointmentpassed){
                var cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.className = "w-100 btn btn-lg btn-outline-primary";
                cancelButton.style.marginBottom = "10px";
                cancelButton.id = appointments._id;
                cancelButton.innerHTML = "Cancel appointment";
                cancelButton.addEventListener("click", function(event) {
                    cancelAppointment(event.target.id);
                });
                div_card_body.appendChild(cancelButton);
                var rescheduleButton = document.createElement("button");
                rescheduleButton.type = "button";
                rescheduleButton.className = "w-100 btn btn-lg btn-outline-primary";
                rescheduleButton.id = appointments._id;
                rescheduleButton.innerHTML = "Reschedule appointment";
                rescheduleButton.addEventListener("click", function(event) {
                    rescheduleAppointment(event.target.id, appointments.barberid, appointments.service, appointments.barber, appointments.user);
                });
                div_card_body.appendChild(rescheduleButton);
            }
            else{
                var cancelled = document.createElement("p");
                cancelled.innerHTML = "Cancelled";
                cancelled.style.fontWeight = "bold";
                div_card_body.appendChild(cancelled);
            }
            div_card.appendChild(div_card_header);
            div_card.appendChild(div_card_body);
            div.appendChild(div_card);
            main_div.appendChild(div);
            
        }
        
    });
    populate_navbar();

}


function cancelAppointment(idname) {
    // cancelled = true in body
    fetch("/api/v1/appointments/"+idname, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"
    },
        body: JSON.stringify( {cancelled: true} )
        })
    .then(response => response.json())
    .then(() => {
       // remove buttons and add cancelled
       var cancelled = document.createElement("p");
       cancelled.innerHTML = "Cancelled";
       cancelled.style.fontWeight = "bold";
       var element = document.getElementById(idname).parentElement;
       console.log(element)
       document.getElementById(idname).parentElement.removeChild(document.getElementById(idname));
       document.getElementById(idname).parentElement.removeChild(document.getElementById(idname));
        element.appendChild(cancelled);
        console.log(element)
            
    });
    console.log("I have deleted: " + idname);
}

function rescheduleAppointment(idname, barberid, service,barbername,user) {
    //  implement page to find new time and date
    // that page should send a request with the following format:
    // {needsRescheduling:false, date: newdate, time: newtime}
    sessionStorage.setItem("appointment", idname);
    sessionStorage.setItem("barberid", barberid);
    sessionStorage.setItem("service", service);
    sessionStorage.setItem("barbername", barbername);
    sessionStorage.setItem("user", user);

    window.location.href = "/reschedule.html";
}

window.onload = history;