function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("barberid");
    sessionStorage.removeItem("service");
    sessionStorage.removeItem("barber");
    sessionStorage.removeItem("time");
    sessionStorage.removeItem("barbername");
    
}

// Logout runs on page load then after 1 second it redirects to the index page
window.onload = logout;
setTimeout(function(){ window.location.href = "/"; }, 1000);
