function displayCells(cellId, daysCount) {
    let template = document.getElementById(cellId)

    let nodes = document.querySelectorAll(".calendar__row")
    let node = nodes[nodes.length - 1]

    for (let i = 0; i < daysCount; ++i) {
        node.appendChild(template.content.cloneNode(true))
    }
}

function displayCalendarFirstHalf(time, daysCount) {
    let template = document.getElementById("calendar-row-first")
    let calendarRow = template.content.cloneNode(true)

    let timeCell = calendarRow.querySelector(".calendar__time")
    timeCell.innerHTML = time

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells("calendar-first-half", daysCount)
}

function displayCalendarSecondHalf(daysCount) {
    let template = document.getElementById("calendar-row-second")
    let calendarRow = template.content.cloneNode(true)

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells("calendar-second-half", daysCount)
}

function displayCalendarRows(startHour, endHour, daysCount) {
    for (let i = startHour; i <= endHour; ++i) {
        displayCalendarFirstHalf(`${i}:00`, daysCount)
        displayCalendarSecondHalf(daysCount)
    }
}

function displayDaysRow(daysCount) {
    let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

    let template = document.getElementById("calendar-day")
    let row = template.content.cloneNode(true)
    document.querySelector(".calendar__table").appendChild(row)

    for (let i = 0; i < daysCount; ++i) {
        let dayTemplate = document.getElementById("calendar-day-cell")
        let dayCell = dayTemplate.content.cloneNode(true)
        dayCell.querySelector(".calendar__day").innerHTML = days[i]

        document.querySelector(".calendar__row").appendChild(dayCell);
    }
}

function cleanCalendar() {
    let table = document.querySelector(".calendar__table");

    while (table.childNodes.length !== 0)
        table.childNodes.forEach(child => child.remove())
}

function displayCalendar(startHour, endHour, daysCount) {
    //TODO: add day numbers
    cleanCalendar()
    displayDaysRow(daysCount)
    displayCalendarRows(startHour, endHour, daysCount)
}

function toggleClicked(initiatorId, disabledId) {
    document.getElementById(initiatorId).classList.toggle('calendar__settings-button-clicked')

    if (isClicked(disabledId))
        document.getElementById(disabledId).classList.remove('calendar__settings-button-clicked')
}

function isClicked(id) {
    return document.getElementById(id).classList.contains('calendar__settings-button-clicked')
}

function displayWorkWeek(start, end) {
    let startHour = start === undefined ? 0 : start
    let endHour = end === undefined ? 23 : end

    if (isClicked('set-workweek'))
        return

    displayCalendar(startHour, endHour, 5)
    toggleClicked('set-workweek', 'set-all-week')
}

function displayAllWeek(start, end) {
    let startHour = start === undefined ? 0 : start
    let endHour = end === undefined ? 23 : end

    if (isClicked('set-all-week'))
        return

    displayCalendar(startHour, endHour, 7)
    toggleClicked('set-all-week', 'set-workweek')
}

function getTimeById(id) {
    let select = document.getElementById(id)
    return Number(select.value.split(':')[0])
}

function ApplyDate() {
    let start = getTimeById("start-time")
    let end = getTimeById("end-time")

    return [start, end]
}

function Apply() {
    //TODO
    //ApplyMaster()
    let times = ApplyDate()
    let start = times[0]
    let end = times[1]

    if (start >= end) {
        alert(`Начало должно быть меньше конца`)
        return
    }

    let currentClicked = document.querySelector(".calendar__settings-button-clicked").id
    if (currentClicked === "set-all-week")
        displayCalendar(start, end, 7)
    else
        displayCalendar(start, end, 5)
}

// TODO
displayAllWeek()
