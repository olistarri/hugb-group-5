// get form info from signup and post to api
/*
// On form submit, check if the user has entered a username and password
// If not, display an error message
// If so, submit the form
function checkForm(e) {
    e.preventDefault();
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if (username == "" || password == "") {
        alert("Please enter a username and password");
        return;
    }
    data = {
        "username": username,
        "password": password
    }    
    fetch("/api/v1/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            // response is jwt token
            if (data["token"]) {
                // decode token
                var decoded = parseJwt(data["token"]);
                // set token in local storage
                localStorage.setItem("token", data["token"]);
                // set user id in local storage
                localStorage.setItem("userid", decoded["userid"]);
                window.location.href = "/";
            }
            else {
                alert("Invalid username or password");
            }
        });
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// on form submit function event listner
document.getElementById("login-button").addEventListener("click",(e) => checkForm(e));

*/

function signup(e){
    e.preventDefault();
    if(document.getElementById("password").value != document.getElementById("password2").value){
        alert("Passwords do not match");
        return;
    }
        var name = document.getElementById("Name").value;
        var username = document.getElementById("exampleInputUsername").value;
        var password = document.getElementById("password").value;
        var email = document.getElementById("exampleInputEmail1").value;
        var phone = document.getElementById("PhoneNumber").value;
        var data = {
            "name": name,
            "username": username,
            "password": password,
            "email": email,
            "phone": phone
        }
        fetch("/api/v1/users", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                // response is jwt token
                if (data["token"]) {
                    // decode token
                    var decoded = parseJwt(data["token"]);
                    // set token in local storage
                    localStorage.setItem("token", data["token"]);
                    // set user id in local storage
                    localStorage.setItem("userid", decoded["userid"]);
                    window.location.href = "/";
                }
        }).catch(error => {
            alert(error);
        });
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


// on form submit function event listner
document.getElementById("signup-button").addEventListener("click",(e) => signup(e));

