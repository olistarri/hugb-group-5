// dynamically populate the barber buttons
function populate_barbers() {
  if (!localStorage.getItem("token") || !localStorage.getItem("userid")) {
    window.location.href = "/login.html";
    return;
  }
    fetch('/api/v1/barbers', {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        var main_div = document.getElementById("main-div");
        for (var i = 0; i < data.length; i++) {
            var barber = data[i];

            var div = document.createElement("div");
            div.className = "col";
            var div_card = document.createElement("div");
            div_card.className = "card mb-4 rounded-3 shadow-sm";
            var div_card_header = document.createElement("div");
            div_card_header.className = "card-header py-3";
            var h4 = document.createElement("h4");
            h4.className = "my-0 fw-normal";
            h4.innerHTML = barber.name;
            div_card_header.appendChild(h4);
            var div_card_body = document.createElement("div");
            div_card_body.className = "card-body";
            var ul = document.createElement("ul");
            ul.className = "list-unstyled mt-3 mb-4";
            var li = document.createElement("li");
            li.innerHTML = barber.description || "No description";
            ul.appendChild(li);
            var button = document.createElement("button");
            button.type = "button";
            button.className = "w-100 btn btn-lg btn-outline-primary";
            button.id = barber._id+"-"+barber.name;
            button.innerHTML = "Book now";
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
    // split the id into the barber id and the barber name
    var id = idname.split("-")[0];
    var name = idname.split("-")[1];
    sessionStorage.setItem("barber", id);
    sessionStorage.setItem("barbername",name);
    window.location.href = "/choose_service.html";
}
window.onload = populate_barbers;
