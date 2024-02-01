function generatePages(totalPages, currentPage, bound) {
    let pages = []
    for (let i = Math.max(1, currentPage - bound); i <= Math.min(totalPages, currentPage + bound); ++i) {
        pages.push(i)
    }
    if (pages[0] - 1 > 1)
        pages.unshift("..")
    if (pages[0] !== 1)
        pages.unshift(1)
    if (totalPages - pages[pages.length - 1] > 1)
        pages.push("..")
    if (pages[pages.length - 1] !== totalPages)
        pages.push(totalPages)

    return pages
}

export function displayPagination(totalPages) {
    let bound = 2
    let currentPage = getCurrentPage()
    let pages = generatePages(totalPages, currentPage, bound)

    let paginationList = document.querySelector(".pagination-list")
    for (let i = 0; i < pages.length; ++i) {
        let template = document.getElementById("pagination__item-template")
        let page = template.content.cloneNode(true)
        paginationList.appendChild(page)
        page = paginationList.lastElementChild

        page.innerHTML = pages[i].toString()
        if (pages[i] === currentPage) {
            page.classList.add("pagination__item__active")
        } else if (pages[i] !== "..") {
            if (Math.abs(pages[i] - currentPage) === bound && pages[i] !== 1 && pages[i] !== totalPages) {
                page.classList.add("pagination__last-neighbour")
            }
            page.onclick = () => changePage(pages[i])
        }
    }
}

export function getCurrentPage(totalPages) {
    let urlParams = new URLSearchParams(window.location.search)
    let currentPage = Number(urlParams.get("page"))
    if (currentPage === 0 || Number.isNaN(currentPage) || currentPage > totalPages)
        currentPage = 1

    return currentPage
}

function changePage(pageNumber) {
    let urlParams = new URLSearchParams(window.location.search)
    urlParams.set("page", pageNumber)
    window.location.replace(`${window.location.origin}${window.location.pathname}?${urlParams.toString()}`)
}