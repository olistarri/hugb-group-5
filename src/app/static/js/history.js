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
            d.innerHTML = "Date: " + appointments["date"];
            t.innerHTML = " Time: " + appointments["time"];
            //li.innerHTML = appointments["description"] || "No description";
            ul.appendChild(serv);
            ul.appendChild(linebreak_1);
            ul.appendChild(price);
            ul.appendChild(linebreak_2);
            ul.appendChild(d);
            ul.appendChild(linebreak_3);
            ul.appendChild(t);
            var button = document.createElement("button");
            button.type = "button";
            button.className = "w-100 btn btn-lg btn-outline-primary";
            button.id = appointments._id+"-"+appointments.name;
            button.innerHTML = "Cancel appointment";
            button.addEventListener("click", function(event) {
                onbuttonclick(event.target.id);
            });
            div_card_body.appendChild(ul);
            div_card_body.appendChild(button);
            div_card.appendChild(div_card_header);
            div_card.appendChild(div_card_body);
            div.appendChild(div_card);
            main_div.appendChild(div);
            
        }
        
    });
            populate_navbar();
}


function onbuttonclick(idname) {
    // Implement delete functionality
    console.log("One day I will have deleted: " + idname);

    //window.location.href = "/choose_time.html";
}

window.onload = history;