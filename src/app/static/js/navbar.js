// run populate_navbar() when the page loads and on every page change
window.onload = populate_navbar;
window.onhashchange = populate_navbar;

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
    navbar.appendChild(CreateNavBarItem("Menu", "/index.html"));
    navbar.appendChild(CreateNavBarItem("Book", "/choose_service.html"));
    navbar.appendChild(CreateNavBarItem("History", "/history.html"));

    if (localStorage.getItem("token")) {
        const JWT = parseJwt(localStorage.getItem("token"));
        if (JWT['exp'] < Date.now() / 1000) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            navbar.appendChild(CreateLoginLogoutButton("Login/Register", "/login.html"));
        }
        else {
            if(JWT.isBarber == true){
                navbar.appendChild(CreateNavBarItem("Barber Dashboard", "/barber_dashboard.html"));
            }
            navbar.appendChild(CreateLoginLogoutButton("Logout", "/logout.html"));
        }
    }
    else {
        navbar.appendChild(CreateLoginLogoutButton("Login/Register", "/login.html"));
    }
    if (window.location.pathname == "/index.html") {
        navbar.appendChild(CreateNavBarItem("Coverage Report", "coverage/index.html"));
    }
}
;
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
    li.style.marginLeft = "auto";
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
    a.innerHTML = text;
    li.appendChild(a);
    return li;
}
