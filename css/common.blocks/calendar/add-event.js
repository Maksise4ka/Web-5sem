function toggleCalendarShow() {
    document.querySelector(".add-event").classList.toggle("add-event__show")
    document.querySelector(".layout-overlay").classList.toggle("layout-overlay__calendar")
}

window.addEventListener('click', function (e) {
    let menu = document.querySelector(".add-event")
    let layoutOverlay = document.querySelector(".layout-overlay")
    if (!menu.contains(e.target) && !e.target.matches(".calendar-settings__create-button") && layoutOverlay.classList.contains("layout-overlay__calendar")) {
        toggleCalendarShow()
    }
})

function timeToMinutes(time) {
    let units = time.split(":").map(u => Number(u))
    return units[0] * 60 + units[1]
}

document.querySelector(".add-event__create-button").addEventListener("click", event => {

    let events = JSON.parse(localStorage.getItem("events"))
    if (events === null)
        events = []

    let isValidForm = document.getElementById("add-event__form").checkValidity();
    if (!isValidForm) {
        return false
    }

    event.preventDefault()
    let start = document.getElementById("event-start").value
    let end = document.getElementById("event-end").value
    if (timeToMinutes(start) >= timeToMinutes(end)) {
        alert("Начало события должно идти раньше конца")
        return false
    }

    let newEvent = {
        "id": events.length + 1,
        "customer": document.getElementById("name").value,
        "master": document.getElementById("event-master").value,
        "date": document.getElementById("date").value,
        "start": start,
        "end": end
    }

    events.push(newEvent)
    localStorage.setItem("events", JSON.stringify(events))
    toggleCalendarShow()
    location.reload();
})