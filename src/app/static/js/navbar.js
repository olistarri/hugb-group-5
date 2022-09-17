// run populate_navbar() when the page loads and on every page change
window.onload += populate_navbar;
window.onhashchange += populate_navbar;


function populate_navbar() {
    var navbar = document.getElementById("navbar");
    if (localStorage.getItem("token")) {
        const JWT = parseJwt(localStorage.getItem("token"));
        if (JWT['exp'] < Date.now() / 1000) {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            navbar.appendChild(createNavbarItem("Login/Register", "/login.html"));
        }
        else {
            navbar.appendChild(createNavbarItem("Logout", "/logout.html"));
        }
    }
    else {
        navbar.appendChild(createNavbarItem("Login/Register", "/login.html"));
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


function createNavbarItem(text, href) {
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
