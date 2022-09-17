function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
}

// Logout runs on page load then after 1 second it redirects to the index page
window.onload = logout;
setTimeout(function(){ window.location.href = "/"; }, 1000);
