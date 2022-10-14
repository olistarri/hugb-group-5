// run populate_navbar() when the page loads and on every page change
window.onload = populate_navbar;
//window.onhashchange = populate_navbar;

/*
    <div class="navbar-box">
      <ul class="nav" id="navbar">
        <li class="nav-item">
          <a class="navbarletter nav-link" href="index.html">Menu</a>
        </li>
        <li class="nav-item">
          <a class="navbarletter nav-link" href="choose_service.html">Book</a>
        </li>
        <li class="nav-item">
          <a class="navbarletter nav-link" href="history.html">History</a>
        </li>
      </ul>
    </div>
*/
function populate_navbar() {
    var navbar = document.getElementById("navbar");
    const leftdiv = document.createElement("div");
    leftdiv.setAttribute("class", "navsegment");
    leftdiv.style.justifyContent = "flex-start";
    const rightdiv = document.createElement("div");
    rightdiv.setAttribute("class", "navsegment");
    rightdiv.style.justifyContent = "flex-end";
    navbar.appendChild(leftdiv);
    navbar.appendChild(rightdiv);

    leftdiv.appendChild(CreateNavBarItem("Menu", "/index.html"));
    leftdiv.appendChild(CreateNavBarItem("Book", "/choose_service.html"));
    

    if (localStorage.getItem("token")) {
        const JWT = parseJwt(localStorage.getItem("token"));
        if (JWT['exp'] < Date.now() / 1000) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            localStorage.removeItem("barberid");
            rightdiv.appendChild(CreateLoginLogoutButton("Login/Register", "/login.html"));
        }
        else { // if token is valid
            if(JWT.isBarber == true){
                leftdiv.appendChild(CreateNavBarItem("Dashboard", "/barber_dashboard.html"));
            }
            else{
                leftdiv.appendChild(CreateNavBarItem("History", "/history.html"));
            }
            getNotifications().then((data) => {
                if (data.length > 0) {
                    rightdiv.appendChild(notification(JWT.isBarber,data));
                }
            });
            rightdiv.appendChild(CreateLoginLogoutButton("Logout", "/logout.html"));
            
        }
    }
    else {
        rightdiv.appendChild(CreateLoginLogoutButton("Login/Register", "/login.html"));
    }
    if (window.location.pathname == "/index.html") {
        leftdiv.appendChild(CreateNavBarItem("Coverage Report", "coverage/index.html"));
    }
};

// get notifications using fetch and return the notifications
function getNotifications() {
    const notis = fetch('/api/v1/notifications', {
        method: 'GET',
        headers: {
            'Authorization': localStorage.getItem("token")
        }}
    )
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
    // resolve response and return
    return notis;
}


function notification(isBarber,data) {
    var li = document.createElement("li");
    li.setAttribute("class", "nav-item, hover");
    var a = document.createElement("a");
    // add tooltip
    a.setAttribute("href", isBarber ? "/barber_dashboard.html" : "/history.html");
    var div = document.createElement("div");
    div.setAttribute("class", "notification");
    var a2 = document.createElement("a");
    a2.setAttribute("class", "notificationtext");
    a2.innerHTML = "!";
    div.appendChild(a2);
    
    tooltip = document.createElement("div");
    tooltip.setAttribute("class", "tooltipz");
    tooltiptext = document.createElement("span");
    tooltip.innerHTML = "You have new notifications!";
    tooltip.style.fontWeight = "bold";
    tooltip.appendChild(document.createElement("hr"));
    // add all notifications from data to tooltip
    for (var i = 0; i < data.length; i++) {
        var noti = document.createElement("p");
        noti.style.fontWeight = "normal";
        noti.innerHTML = data[i].message;
        tooltiptext.appendChild(noti);
    }
    tooltip.appendChild(tooltiptext);
    a.appendChild(tooltip);

    a.appendChild(div);
    li.appendChild(a);
    return li;

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


function CreateLoginLogoutButton(text, href) {
    var li = document.createElement("li");
    li.setAttribute("class", "nav-item");// set css
    //li.style.marginLeft = "auto";
    li.style.display = "flex";
    var a = document.createElement("a");
    a.setAttribute("class", "navbarletter nav-link");
    a.setAttribute("href", href);
    a.innerHTML = text;
    li.appendChild(a);
    return li;
}

function CreateNavBarItem(text, href) {
    var li = document.createElement("li");
    li.setAttribute("class", "nav-item");// set css
    var a = document.createElement("a");
    a.setAttribute("class", "navbarletter nav-link");
    a.setAttribute("href", href);
    a.setAttribute("id", text);
    a.innerHTML = text;
    li.appendChild(a);
    return li;
}
