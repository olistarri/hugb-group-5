// run populate_navbar() when the page loads and on every page change
window.onload = populate_navbar;
//window.onhashchange = populate_navbar;

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


// Creates the yellow notification box on the menu screen and populates it with all of the appointments 
// that need rescheduling or to be cancelled.
function menuNotification(isBarber, data) {
    var notifBox = document.createElement("div");
    notifBox.setAttribute("id", "notif-box");
    notifBox.classList.add("center-div");

    var notifBoxContent = document.createElement("div");
    
    var notifBoxHead = document.createElement("div");
    notifBoxHead.classList.add("center-div");

    var headerH4 = document.createElement("h4");
    headerH4.classList.add("notif-box-head");
    headerH4.innerHTML = "You have important notifications!";

    notifBoxHead.appendChild(headerH4);

    var bulletList = document.createElement("ul");

    for (var i = 0; i < data.length; i++) {
        var line = document.createElement("li");
        line.innerHTML = data[i].message;
        bulletList.appendChild(line);
    }

    var line2 = document.createElement("li");
    line2.innerHTML = "Please reschedule or cancel the appointment(s) by clicking "

    var a = document.createElement("a"); // href to the history page so the user can go directly to the cancel/reschedule section
    a.innerHTML = "here.";
    a.setAttribute("href", isBarber ? "/barber_dashboard.html" : "/history.html");
    line2.appendChild(a);

    bulletList.appendChild(line2);

    notifBoxContent.appendChild(notifBoxHead);
    notifBoxContent.appendChild(bulletList);

    notifBox.appendChild(notifBoxContent);

    var boxLocation = document.getElementById("notifcation-box-filler");
    boxLocation.appendChild(notifBox);
}


function notification(isBarber,data) {

    var path = window.location.pathname;
    var page = path.split("/").pop();

    if (page == "index.html") { // if menu we add the notification box to the menu screen
        menuNotification(isBarber, data);
    }

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
