
var buttons = {'haircut-book-button':['Haircut', 5999] ,'colouring-book-button': ['Colouring', 10999], 'shave-book-button': ['Shave', 2999]};
var keys = Object.keys(buttons);

// if the user is not logged in, redirect to login page
if (!localStorage.getItem("token") || !localStorage.getItem("userid")) {
    window.location.href = "/login.html";
    return;
}

for (var i = 0; i < keys.length; i++) {
    document.getElementById(keys[i]).addEventListener('click', function(event){
        choose_service_main(event.target.id);
    })
}

function choose_service_main(key) {
    retArr = buttons[key];
    sessionStorage.setItem('service', JSON.stringify(retArr));
    window.location.href = 'choose_barber.html';
}