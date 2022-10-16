
// if the user is not logged in, redirect to login page
if (!localStorage.getItem("token") || !localStorage.getItem("userid")) {
    window.location.href = "/login.html";
    //return;
}

fetch_services();

function choose_service_main(key) {
    retArr = buttons[key];
    sessionStorage.setItem('service', retArr);
    window.location.href = 'choose_time.html';
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function fetch_services(){
    const barberid = sessionStorage.getItem("barber");
    if (barberid == null) {
        window.location.href = "/choose_barber.html";
    }
    fetch('/api/v1/barbers/'+barberid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'},
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            alert(data.message);
        }
        else {
            var services = data.services;
            var services_list = document.getElementById("services-list");
            for (var i = 0; i < services.length; i++) {
                var service = services[i];
                
                var col = document.createElement("div");
                col.classList.add("col");
                var card = document.createElement("div");
                card.classList.add("card");
                card.classList.add("mb-4");
                card.classList.add("rounded-3");
                card.classList.add("shadow-sm");
                var card_header = document.createElement("div");
                card_header.classList.add("card-header");
                card_header.classList.add("py-3");
                var h4 = document.createElement("h4");
                h4.classList.add("my-0");
                h4.classList.add("fw-normal");
                h4.innerHTML = service.name;
                card_header.appendChild(h4);
                card.appendChild(card_header);
                var card_body = document.createElement("div");
                card_body.classList.add("card-body");
                var h1 = document.createElement("h1");
                h1.classList.add("card-title");
                h1.classList.add("pricing-card-title");
                h1.innerHTML = service.price + "<small class=\"text-muted fw-light\"> ISK</small>";
                card_body.appendChild(h1);
                var ul = document.createElement("ul");
                ul.classList.add("list-unstyled");
                ul.classList.add("mt-3");
                ul.classList.add("mb-4");
                var li = document.createElement("li");
                li.innerHTML = service.description || "No description";
                ul.appendChild(li);
                card_body.appendChild(ul);
                var button = document.createElement("button");
                button.classList.add("w-100");
                button.classList.add("btn");
                button.classList.add("btn-lg");
                button.classList.add("btn-outline-primary");
                button.id = service.name + "-book-button";
                button.innerHTML = "Book now";
                card_body.appendChild(button);
                card.appendChild(card_body);
                col.appendChild(card);
                services_list.appendChild(col);

                document.getElementById(service.name + "-book-button").addEventListener('click', function(event){
                    choose_service_main(event.target.id);
                });
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}