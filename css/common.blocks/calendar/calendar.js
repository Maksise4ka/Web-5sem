function getCurrentDate() {
    let urlParams = new URLSearchParams(window.location.search)
    let date = urlParams.get("date")
    if (date === null)
        return new Date()

    date = Date.parse(date)
    if (Number.isNaN(date))
        return new Date()

    return new Date(date)
}

function setToday() {
    window.location.assign(window.location.pathname)
}

function setNextWeek() {
    MoveToDays(7)
}

function setPrevWeek() {
    MoveToDays(-7)
}

function MoveToDays(offset) {
    let currentDate = getCurrentDate()
    let nextWeekDate = new Date(currentDate.setDate(currentDate.getDate() + offset)).toISOString().split('T')[0]
    window.location.assign(window.location.pathname + `?date=${nextWeekDate}`)
}

function displayCells(time, cellId, daysCount) {
    let template = document.getElementById(cellId)

    let nodes = document.querySelectorAll(".calendar__row")
    let node = nodes[nodes.length - 1]

    for (let i = 0; i < daysCount; ++i) {
        let child = template.content.cloneNode(true)
        child.children[0].setAttribute("id", `${time}_${i}`)
        node.appendChild(child)
    }
}

function displayCalendarFirstHalf(time, daysCount) {
    let template = document.getElementById("calendar-row-first")
    let calendarRow = template.content.cloneNode(true)

    let timeCell = calendarRow.querySelector(".calendar__time")
    timeCell.innerHTML = time

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells(time, "calendar-first-half", daysCount)
}

function displayCalendarSecondHalf(time, daysCount) {
    let template = document.getElementById("calendar-row-second")
    let calendarRow = template.content.cloneNode(true)

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells(time, "calendar-second-half", daysCount)
}

function displayCalendarRows(startHour, endHour, daysCount) {
    for (let i = startHour; i <= endHour; ++i) {
        displayCalendarFirstHalf(`${i}:00`, daysCount)
        displayCalendarSecondHalf(`${i}:30`, daysCount)
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
        dayCell.querySelector(".calendar__day").setAttribute("id", `calendar-weekday-${i}`)

        document.querySelector(".calendar__row").appendChild(dayCell);
    }
}

function cleanCalendar() {
    let table = document.querySelector(".calendar__table");

    while (table.childNodes.length !== 0)
        table.childNodes.forEach(child => child.remove())
}

function displayCurrentWeekRange(date) {
    function MonthLocale(weekDate) {
        return weekDate.toLocaleString('default', {month: 'long'})
    }

    let day = date.getDay()
    let firstWeekDay = new Date(new Date(date.getTime()).setDate(date.getDate() - day + 1))
    let lastWeekDay = new Date(new Date(date.getTime()).setDate(date.getDate() + 7 - day))

    let element = document.querySelector(".calendar-settings__current-week")
    element.innerHTML = MonthLocale(firstWeekDay) === MonthLocale(lastWeekDay) ?
        `${firstWeekDay.getDate()} - ${lastWeekDay.getDate()} ${MonthLocale(firstWeekDay)}` :
        `${firstWeekDay.getDate()} ${MonthLocale(firstWeekDay)} - ${lastWeekDay.getDate()} ${MonthLocale(lastWeekDay)}`
}

function markCurrentWeekday(date) {
    const millisInDay = 1000 * 60 * 60 * 24
    let now = Math.floor(new Date().getTime() / millisInDay)

    if (now !== Math.floor(date.getTime() / millisInDay))
        return

    let day = date.getDay()
    let weekRow = document.getElementById(`calendar-weekday-${day - 1}`);
    weekRow.classList.add("calendar__current-weekday")
}

function displayCalendar(startHour, endHour, daysCount, date) {
    displayCurrentWeekRange(date)
    cleanCalendar()
    displayDaysRow(daysCount)
    displayCalendarRows(startHour, endHour, daysCount)
    markCurrentWeekday(date)
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

    displayCalendar(startHour, endHour, 5, getCurrentDate())
    toggleClicked('set-workweek', 'set-all-week')
}

function displayAllWeek(start, end) {
    let startHour = start === undefined ? 0 : start
    let endHour = end === undefined ? 23 : end

    if (isClicked('set-all-week'))
        return

    displayCalendar(startHour, endHour, 7, getCurrentDate())
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
        displayCalendar(start, end, 7, getCurrentDate())
    else
        displayCalendar(start, end, 5, getCurrentDate())
}

// TODO
displayAllWeek()
