var buttons = {
    'Andri-button':["6325eb956aec9d26d37d7723"],
    'Sindri-button': ["63260d8d6d67379920e9005e"],
    'Kari-button': ["6325eb956aec9d26d37d7723"]
};
var keys = Object.keys(buttons);

for (var i = 0; i < keys.length; i++) {
    document.getElementById(keys[i]).addEventListener('click', function(event){
        choose_service_main(event.target.id);
    })
}

function choose_service_main(key) {
    return_key = key;
    retArr = buttons[key];
    sessionStorage.setItem('barber', retArr[0]);
    window.location.href = 'choose_time.html'
}