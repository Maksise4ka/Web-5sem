function getCurrentTimeRangeDeprecated() {
    // TODO Это будет в calendar
    return ["0:00", "23:00"]
}

function findRelevantTs(start, dayNumber) {
    return document.getElementById(`${start}_${dayNumber}`)
}

/**
 * Конвертирование времени в формате "xx:xx" до минут
 * @param time
 * @returns {number}
 */
function convertTimeToMinutes(time) {
    let units = time.split(":").map(u => Number(u))
    return units[0] * 60 + units[1]
}

function calculateTimeSlotCount(startMinute, endMinute) {
    return (endMinute - startMinute) / 30
}

// let event = {
//     "customer": "",
//     "master",
//     "date": "",
//     "start": "",
//     "end": ""
// }
function displayEvent(event) {
    // TODO будем это делать в calendar
    let timeRange = getCurrentTimeRangeDeprecated().map(convertTimeToMinutes)
    let rangeStart = timeRange[0]
    let rangeEnd = timeRange[1]

    let eventStart = convertTimeToMinutes(event.start)
    let eventEnd = convertTimeToMinutes(event.end)

    if (!(eventStart >= rangeStart ||eventEnd <= rangeEnd))
        return

    let timeSlotsCount = calculateTimeSlotCount(eventStart, eventEnd) // TODO corner cases
    // let timeSlotsCount = 5
    let cell = findRelevantTs(event.start, 1) // TODO

    let template = document.getElementById("calendar-event")
    let eventNode = template.content.cloneNode(true)
    // let height = document.defaultView.getComputedStyle(cell).height.slice(0, -2) * timeSlotsCount
    let height = cell.offsetHeight * timeSlotsCount - 5

    eventNode.children[0].style.setProperty("height", `${height}px`)
    cell.appendChild(eventNode)
}

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

let event = {
    "customer": "f",
    "master": "f",
    "date": "?",
    "start": "2:30",
    "end": "8:30"
}

displayEvent(event)

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
    if (convertTimeToMinutes(start) >= convertTimeToMinutes(end)) {
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