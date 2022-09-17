var datesSelection = document.getElementById('date-input');
datesSelection.addEventListener('change', function(){
    var date = fixDate(datesSelection.value);
    if (!isNaN(date[0])) { // If a valid date is selected, the site displays the date in a p tag
        refresh_event_listeners();
    }
})

function refresh_event_listeners() {
    var timebox = document.getElementById('timebox');
    for (var i = 0; i < timebox.children.length; i++) {
        timebox.children[i].addEventListener('click', function(event) {
            choose_time_main(event.target.innerHTML);
        })
    }
}

function choose_time_main(time) {
    sessionStorage.setItem('time', JSON.stringify([datesSelection.value, time]))
    window.location.href = 'booking_confirm.html';
}
