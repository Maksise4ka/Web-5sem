import {calculateEventsCardWidth} from "./display-event.js";

/**
 * Возвращает дату, неделю которой нужно отобразить
 * Эта дата берется либо из queryString, либо берется текущая
 * @returns {Date} - дата
 */
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

/**
 * Возвращает временной диапазон календаря из query string, или [0, 23] если его там нет
 * @returns {number[]} - массив из двух элементов, начальный и конечный час
 */
function getCurrentTimeRange() {
    function parseHour(urlParams, param, defaultHour) {
        let hour = urlParams.get(param)
        if (hour === null)
            return defaultHour

        hour = Number(hour)
        if (Number.isNaN(hour))
            return defaultHour

        return hour
    }

    let urlParams = new URLSearchParams(window.location.search)
    let start = Math.max(parseHour(urlParams, "start", 0), 0)
    let end = Math.min(parseHour(urlParams, "end", 23), 23)

    return [start, end]
}

/**
 * Возвращает true, если есть параметр work-week в query string, означающий, отображать ли рабочую неделю
 * @returns {boolean} - отображать ли рабочую неделю
 */
function isWorkWeek() {
    let urlParams = new URLSearchParams(window.location.search)
    let isWorkWeek = urlParams.get("work-week")

    return !(isWorkWeek === null || isWorkWeek !== "true");
}

/**
 * Возвращает даты, равные датам понедельника и воскресенья недели date
 * @param date - дата, относительно которой ищется пн и вск
 * @returns {Date[]} - пн и вск
 */
function getWeekRange(date) {
    let day = date.getDay()
    // так как тут британское исчисление недели
    if (day === 0)
        day = 6
    else
        day = day - 1

    let firstWeekDay = new Date(new Date(new Date(date.getTime()).setDate(date.getDate() - day)).setHours(0, 0, 0, 0))
    let lastWeekDay = new Date(new Date(new Date(date.getTime()).setDate(date.getDate() + 7 - day - 1)).setHours(23, 59, 59, 999))
    return [firstWeekDay, lastWeekDay]
}

/**
 * Проверяет что входная дата относится к текущей неделе
 * @param date - входная дата
 * @param weekDate
 * @returns {boolean} - true, если относится
 */
function isDateInThisWeek(date, weekDate) {
    let range = getWeekRange(weekDate)
    let firstDay = range[0].getTime()
    let secondDay = range[1].getTime()
    let dateTime = date.getTime()

    return firstDay <= dateTime && secondDay >= dateTime
}

/**
 * Конвертит дату из js в формат "yyy-mm-dd" с сохранением тайм зоны клиента
 * @param date - дата
 * @returns {string} - строка в формате "yyy-mm-dd"
 */
function dateToString(date) {
    return new Date(date.getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
}

// TODO: потом добавить мастеров
/**
 * Создает query строку, принимая на вход параметры. Если они null - то берутся те, что были до этого в query string,
 * если их тоже нет - то дефолтные
 * @param start - начальный час (дефолтный - 0)
 * @param end - конечный час (дефолтный - 23)
 * @param date - дата (дефолтная - текущая)
 * @param workWeek - true - если рабочая неделя (дефолтная - false)
 * @returns {string} - query строка
 */
function prepareQueryString(start, end, date, workWeek) {
    let defaultRange = getCurrentTimeRange()

    if (start === null)
        start = defaultRange[0]
    if (end === null)
        end = defaultRange[1]
    if (date === null)
        date = getCurrentDate()
    if (workWeek === null)
        workWeek = isWorkWeek()

    let urlParams = new URLSearchParams()
    if (start !== 0)
        urlParams.set("start", start)

    if (end !== 23)
        urlParams.set("end", end)

    if (!isDateInThisWeek(date, new Date()))
        urlParams.set("date", dateToString(date))

    if (workWeek)
        urlParams.set("work-week", true.toString())

    return urlParams.toString()
}

function setToday() {
    let queryString = prepareQueryString(null, null, new Date(), null)
    window.location.assign(window.location.pathname + `?${queryString}`)
}

function setNextWeek() {
    MoveToDays(7)
}

function setPrevWeek() {
    MoveToDays(-7)
}

/**
 * На сколько нужно сдвинуть календарь относительно текущей отображаемой даты
 * @param offset - сдвиг
 */
function MoveToDays(offset) {
    let currentDate = getCurrentDate()
    let nextWeekDate = new Date(currentDate.setDate(currentDate.getDate() + offset))

    let queryString = prepareQueryString(null, null, nextWeekDate, null)
    window.location.assign(window.location.pathname + `?${queryString}`)
}

/**
 * Отображает строку календаря (пока это полчаса)
 * @param time - время, закрепленное за строкой
 * @param cellId - идентификатор шаблона ячейки (для первой половины часа - calendar-first-half,
 * для второй - calendar-second-half
 * @param daysCount - количество отображаемых дней в неделе
 */
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

/**
 * Отображает строку, которая является первой половиной часа
 * @param time - время, закрепленное за строкой
 * @param daysCount - количество отображаемых дней в неделе
 */
function displayCalendarFirstHalf(time, daysCount) {
    let template = document.getElementById("calendar-row-first")
    let calendarRow = template.content.cloneNode(true)

    let timeCell = calendarRow.querySelector(".calendar__time")
    timeCell.innerHTML = time

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells(time, "calendar-first-half", daysCount)
}

/**
 * Отображает строку, которая является второй половиной часа
 * @param time - время, закрепленное за строкой
 * @param daysCount - количество отображаемых дней в неделе
 */
function displayCalendarSecondHalf(time, daysCount) {
    let template = document.getElementById("calendar-row-second")
    let calendarRow = template.content.cloneNode(true)

    document.querySelector(".calendar__table").appendChild(calendarRow)
    displayCells(time, "calendar-second-half", daysCount)
}

/**
 * Отображает все строки календаря в заданной часовом и дневном диапазоне
 * @param startHour - начальный час
 * @param endHour - конечный час
 * @param daysCount - количество отображаемых дней в неделе
 */
function displayCalendarRows(startHour, endHour, daysCount) {
    for (let i = startHour; i <= endHour; ++i) {
        displayCalendarFirstHalf(`${i}:00`, daysCount)
        displayCalendarSecondHalf(`${i}:30`, daysCount)
    }
}

/**
 * Отображает первую строку календаря с днями недели
 * @param daysCount - количество отображаемых дней в неделе
 */
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

/**
 * Отображает крайние даты недели (от понедельника до воскресенья)
 * @param date - дата, относительно которой будеут считаться крайние даты
 */
function displayCurrentWeekRange(date) {
    function MonthLocale(weekDate) {
        return weekDate.toLocaleString('default', {month: 'long'})
    }

    let dayRange = getWeekRange(date)
    let firstWeekDay = dayRange[0]
    let lastWeekDay = dayRange[1]

    let element = document.querySelector(".calendar-settings__current-week")
    element.innerHTML = MonthLocale(firstWeekDay) === MonthLocale(lastWeekDay) ?
        `${firstWeekDay.getDate()} - ${lastWeekDay.getDate()} ${MonthLocale(firstWeekDay)}` :
        `${firstWeekDay.getDate()} ${MonthLocale(firstWeekDay)} - ${lastWeekDay.getDate()} ${MonthLocale(lastWeekDay)}`
}

/**
 * Помечает дополнительным классом текущий день (если он отображен)
 * @param date - текущая дата
 */
function markCurrentWeekday(date) {
    if (!isDateInThisWeek(date, new Date()))
        return

    // так тут британское исчисление недели
    let day = new Date().getDay()
    day = day === 0 ? 6 : day - 1

    let weekRow = document.getElementById(`calendar-weekday-${day}`);
    if (weekRow === null)
        return

    weekRow.classList.add("calendar__current-weekday")
}

/**
 * Отображает календарь в заданной часовом и дневном диапазоне относительно заданной даты
 * @param startHour - начальный час
 * @param endHour - конечный час
 * @param daysCount - количество отображаемых дней в неделе
 * @param date - дата, неделю которой нужно отобразить
 */
function displayCalendar(startHour, endHour, daysCount, date) {
    displayCurrentWeekRange(date)
    displayDaysRow(daysCount)
    displayCalendarRows(startHour, endHour, daysCount)
    markCurrentWeekday(date)
    markCurrentWeekButton(daysCount)
}

/**
 * Помечает специальным классом выбранную опцию рабочая/полная неделя
 * @param daysCount - количество отображаемых дней, 5 - рабочая, 7 - полная
 */
function markCurrentWeekButton(daysCount) {
    let buttonId = daysCount === 5 ? "set-workweek" : "set-all-week"
    document.getElementById(buttonId).classList.add('calendar__settings-button-clicked')

}

/**
 * Отображает рабочую неделю (без сб и вс) в заданном часовом диапазоне
 */
function displayWorkWeek() {
    let queryString = prepareQueryString(null, null, null, true)
    window.location.assign(window.location.pathname + `?${queryString}`)
}

/**
 * Отображает всю неделю в заданном часовом диапазоне
 */
function displayAllWeek() {
    let queryString = prepareQueryString(null, null, null, false)
    window.location.assign(window.location.pathname + `?${queryString}`)
}

function ApplyDate() {
    function getTimeById(id) {
        let select = document.getElementById(id)
        return Number(select.value.split(':')[0])
    }

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

    let queryString = prepareQueryString(start, end, null, null)
    window.location.assign(window.location.pathname + `?${queryString}`)
}

/**
 * Конвертирование времени в формате "xx:xx" до минут
 * @param time - время в формате "xx:xx"
 * @returns {number} - количество минут
 */
function convertTimeToMinutes(time) {
    let units = time.split(":").map(u => Number(u))
    return units[0] * 60 + units[1]
}

function getWeekday(date) {
    let day = date.getDay()
    day = day === 0 ? 6 : day - 1

    return day
}

/**
 * Фильтрует события из localStorage, выдавая те, что должны быть видны на календари
 * @returns {*} - массив видимых событий
 */
function filterEvents() {
    let range = getCurrentTimeRange().map(x => x * 60)

    function filterEvent(event) {
        let date = new Date(event["date"])
        if (!isDateInThisWeek(date, getCurrentDate()))
            return false
        if (isWorkWeek() && getWeekday(new Date(event.date)) >= 5)
            return false

        let eventStart = convertTimeToMinutes(event.start)
        let eventEnd = convertTimeToMinutes(event.end)

        return eventStart >= range[0] && eventEnd <= range[1];
    }

    let events = JSON.parse(localStorage.getItem("events"))
    if (events === null)
        events = []

    return events.filter(filterEvent)
}

/**
 * Отображает события, которые попадают в заданный диапазон календаря
 */
function displayEventsWithFilter() {
    let events = filterEvents()
    events = calculateEventsCardWidth(events)

    return events.forEach(displayEvent)
}

/**
 * Находит событие в таблице календаря и применяет ограничения по ширине и высоте
 * @param event
 */
function displayEvent(event) {
    function findRelevantTs(start, dayNumber) {
        return document.getElementById(`${start}_${dayNumber}`)
    }

    function calculateTimeSlotCount(startMinute, endMinute) {
        return (endMinute - startMinute) / 30
    }

    let eventStart = convertTimeToMinutes(event.start)
    let eventEnd = convertTimeToMinutes(event.end)

    let timeSlotsCount = calculateTimeSlotCount(eventStart, eventEnd)
    // let timeSlotsCount = 5

    let day = getWeekday(new Date(event.date))
    let cell = findRelevantTs(event.start, day)

    let template = document.getElementById("calendar-event")
    let eventNode = template.content.cloneNode(true)
    let height = cell.offsetHeight * timeSlotsCount - 5
    let width = (cell.offsetWidth - 5) / event.compress
    let marginLeft = cell.offsetWidth / event.compress * event.offset
    // let height = document.defaultView.getComputedStyle(cell).height.slice(0, -2) * timeSlotsCount

    eventNode.children[0].style.setProperty("height", `${height}px`)
    eventNode.children[0].style.setProperty("width", `${width}px`)
    eventNode.children[0].style.setProperty("margin-left", `${marginLeft}px`)
    eventNode.children[0].innerHTML = event.description
    cell.appendChild(eventNode)
}

(() => {
    document.querySelector(".calendar-settings__apply").addEventListener('click', Apply)
    document.getElementById("set-today").addEventListener('click', setToday)
    document.getElementById("set-prev-week").addEventListener('click', setPrevWeek)
    document.getElementById("set-next-week").addEventListener('click', setNextWeek)
    document.getElementById("set-all-week").addEventListener('click', displayAllWeek)
    document.getElementById("set-workweek").addEventListener('click', displayWorkWeek)

    function displayOptions(selectId, start, end, withHalf = false) {
        let label = document.getElementById(selectId)
        let template = document.getElementById("calendar-option")
        for (let i = start; i < end; ++i) {
            let child = template.content.cloneNode(true)
            label.appendChild(child)
            child = label.lastElementChild
            child.innerHTML = `${i}:00`
            if (withHalf) {
                let child = template.content.cloneNode(true)
                label.appendChild(child)
                child = label.lastElementChild
                child.innerHTML = `${i}:30`
            }
        }
    }

    displayOptions("start-time", 0, 24)
    displayOptions("end-time", 0, 23)
    displayOptions("event-start", 0, 24, true)
    displayOptions("event-end", 0, 24, true)

    let date = getCurrentDate()
    let range = getCurrentTimeRange()
    if (isWorkWeek())
        displayCalendar(range[0], range[1], 5, date)
    else
        displayCalendar(range[0], range[1], 7, date)

    displayEventsWithFilter()
    // TODO добавить master в query string (желательно массив)
})()
