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
            .then( data => {
                // response is a list of appointments
                var main_div = document.getElementById("main-div");
                for (var i = 0; i < data.length; i++) {
                    var appointment = data[i];
                    var div = document.createElement("div");
                    div.className = "card";
                    var div_body = document.createElement("div");
                    div_body.className = "card-body";
                    var h5 = document.createElement("h5");
                    h5.className = "card-title";
                    h5.innerHTML = appointment["barber"];
                    var p = document.createElement("p");
                    p.className = "card-text";
                    p.innerHTML = "Service: " + appointment["service"];
                    p.innerHTML = "Date: " + appointment["date"] + " Time: " + appointment["time"];
                    div_body.appendChild(h5);
                    div_body.appendChild(p);
                    div.appendChild(div_body);
                    main_div.appendChild(div);
                }
            });
            populate_navbar();
}

window.onload = history;