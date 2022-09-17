var buttons = {'Andri-button':['Andri'] ,'Sindri-button': ['Sindri'], 'Kari-button': ['Kári']};
var keys = Object.keys(buttons);

for (var i = 0; i < keys.length; i++) {
    document.getElementById(keys[i]).addEventListener('click', function(event){
        choose_service_main(event.target.id);
    })
}

function choose_service_main(key) {
    return_key = key;
    retArr = buttons[key];
    sessionStorage.setItem('barber', JSON.stringify(retArr))
    window.location.href = 'choose_time.html'
}