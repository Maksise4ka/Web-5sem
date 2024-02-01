/**
 * Считает размеры и смещение входящих карточек друг относительно друга
 * @param events - события, у которых нужно посчитать размеры карточек
 * @returns {*} - те же events с добавлением двух полей: compress - во сколько раз карточку нужно сжать
 * и offset - сдвиг влево на width * offset / compress, где width - размер слота с временем
 */
export function calculateEventsCardWidth(events) {
    const daysCount = 7
    const hoursCount = 24

    function timeToIndex(time) {
        let units = time.split(":").map(u => Number(u))
        return units[0] * 2 + units[1] / 30
    }

    function getWeekday(date) {
        let day = date.getDay()
        day = day === 0 ? 6 : day - 1

        return day
    }

    function prepareTable(events) {

        let table = new Array(daysCount)
        for (let i = 0; i < daysCount; ++i) {
            table[i] = new Array(hoursCount * 2)
            for (let j = 0; j < hoursCount * 2; ++j)
                table[i][j] = []
        }

        events.forEach(e => {
            let weekday = getWeekday(new Date(e.date))
            let start = timeToIndex(e.start)
            let end = timeToIndex(e.end)
            for (let i = start; i < end; ++i) {
                table[weekday][i].push(e)
            }
        })

        for (let i = 0; i < daysCount; ++i)
            for (let j = 0; j < hoursCount * 2; ++j)
                table[i][j].sort((a, b) => timeToIndex(a.start) - timeToIndex(b.start))

        return table
    }

    let table = prepareTable(events)

    for (let i = 0; i < daysCount; ++i) {
        for (let j = 0; j < hoursCount * 2; ++j) {
            for (let k = 0; k < table[i][j].length; ++k) {
                let e = table[i][j][k]
                e.compress = e.compress === undefined ? 1 : e.compress
                e.compress = Math.max(e.compress, table[i][j].length)
            }
        }
    }

    for (let i = 0; i < daysCount; ++i) {
        let compressMap = []

        for (let j = 0; j < hoursCount * 2; ++j) {
            if (table[i][j].length === 0)
                continue

            let compress = table[i][j].reduce((prev, cur) => Math.max(prev, cur.compress), 0)
            let count = compressMap.reduce((prev, cur) => cur === undefined ? prev : prev + cur, 0)
            if (count === 0) {
                compressMap = new Array(compress)
            }
            for (let k = 0; k < table[i][j].length; ++k) {
                let e = table[i][j][k]
                e.compress = compress
                if (timeToIndex(e.start) === j) {
                    for (let l = 0; l < compress; ++l) {
                        if (compressMap[l] !== 1) {
                            compressMap[l] = 1
                            e.offset = l
                            break;
                        }
                    }
                }
            }

            for (let k = 0; k < table[i][j].length; ++k) {
                let e = table[i][j][k]
                if (timeToIndex(e.end) === j + 1) {
                    compressMap[e.offset] = 0
                }
            }
        }
    }

    return events
}