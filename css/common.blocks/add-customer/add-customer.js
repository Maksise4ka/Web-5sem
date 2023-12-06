function getFetchPages() {
    return 10
}

function getTotalPages() {
    let customers = JSON.parse(localStorage.getItem("customers"))
    let len;
    if (customers === null)
        len = 0
    else
        len = customers.length

    let customersPerPage = 3 * 3
    return Math.ceil(len / customersPerPage) + getFetchPages()
}

(() => {
    displayPagination(1)

    window.addEventListener('load', function () {
        fetchCustomers(1)
    })
})()

function clearPagination() {
    document.querySelector(".pagination-list").childNodes.forEach(child => {
        if (child.classList !== undefined) {
            if (child.classList.contains("pagination__item")) {
                child.remove()
            }
        }
    })
}

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

function displayPagination(currentPage) {
    //TODO: correct pagination
    clearPagination()

    let bound = 2
    let totalPages = getTotalPages()
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
        }
        else if(pages[i] !== "..") {
            if (Math.abs(pages[i] - currentPage) === bound) {
                page.classList.add("pagination__last-neighbour")
            }
            page.onclick = () => changePage(pages[i])
        }
    }
}

function changePage(pageNumber) {
    displayPagination(pageNumber)

    document.querySelectorAll(".pagination__item").forEach(e => {
        if (Number(e.innerHTML) === pageNumber) {
            e.classList.add("pagination__item__active")
        } else {
            e.classList.remove("pagination__item__active")
        }
    })

    clearCustomers()
    hideError()
    if (pageNumber <= getFetchPages()) {
        fetchCustomers(pageNumber)
    } else {
        displayFromLocalStorage()
    }
}

function clearCustomers() {
    let customersMenu = document.getElementById("customers-menu")
    customersMenu.childNodes.forEach(child => {
        if (child.classList !== undefined) {
            if (child.classList.contains("customer")) {
                child.remove()
            }
        }
    })
}

function displayError() {
    document.querySelector(".customer-menu__error").classList.remove("customer-menu__error__hide")
    document.querySelector(".customers-menu__content").classList.add("customers-menu__content-error")
}

function hideError() {
    document.querySelector(".customer-menu__error").classList.add("customer-menu__error__hide")
    document.querySelector(".customers-menu__content").classList.remove("customers-menu__content-error")
}

function hideLoading() {
    document.querySelector(".customer-menu__preloader").classList.add("customer-menu__error__hide")
    document.querySelector(".customers-menu__content").classList.remove("customers-menu__content-loading")
}

function displayLoading() {
    document.querySelector(".customer-menu__preloader").classList.remove("customer-menu__error__hide")
    document.querySelector(".customers-menu__content").classList.add("customers-menu__content-loading")
}

function displayFromLocalStorage() {
    let customers = JSON.parse(localStorage.getItem("customers"))
    if (customers == null)
        customers = []

    let activatedPage = Number(document.querySelector(".pagination__item__active").innerHTML) - getFetchPages()
    let itemsPerPage = 3 * 3

    customers
        .slice((activatedPage - 1) * itemsPerPage, activatedPage * itemsPerPage)
        .forEach(c => displayCustomer(c))
}

function fetchCustomers(pageNumber) {
    displayLoading()
    let query = fetch(`https://randomuser.me/api/?results=9&page=${pageNumber}`)
    query.then(async data => {
        let d = await data.json()
        let customers = d["results"]
        for (let i = 0; i < customers.length; ++i) {
            let newCustomer = {
                "id": 10,
                "firstname": customers[i]["name"]["first"],
                "other-name": "",
                "surname": customers[i]["name"]["last"],
                "email": customers[i]["email"],
                "phone": customers[i]["phone"],
                "img": customers[i]["picture"]["large"]
            }

            displayCustomer(newCustomer)
        }
    }).catch(displayError).finally(hideLoading)
}

function displayCustomer(customer) {
    let customersMenu = document.getElementById("customers-menu")
    let template = document.getElementById("customer-template")
    let customerContent = template.content.cloneNode(true)

    customersMenu.appendChild(customerContent)
    customerContent = customersMenu.lastElementChild;
    customerContent.querySelector(".customer__name").innerHTML = `${customer.firstname} ${customer.surname} ${customer["other-name"]}`
    customerContent.querySelector(".customer__phone").innerHTML = customer.phone
    customerContent.querySelector(".customer__email").innerHTML = customer.email
    if (customer.img !== undefined)
        customerContent.querySelector(".customer__photo").src = customer.img
}

function toggleCustomerShow() {
    document.querySelector(".add-customer").classList.toggle("add-customer__show")
    document.querySelector(".layout-overlay").classList.toggle("layout-overlay__customer")
}


window.addEventListener('click', function (e) {
    let menu = document.querySelector(".add-customer")
    let layoutOverlay = document.querySelector(".layout-overlay")
    if (!menu.contains(e.target) && !e.target.matches(".customers-menu__add-button") && layoutOverlay.classList.contains("layout-overlay__customer")) {
        toggleCustomerShow()
    }
})

document.querySelector(".add-customer__create-button").addEventListener("click", event => {
    let customers = JSON.parse(localStorage.getItem("customers"))
    if (customers === null)
        customers = []

    let isValidForm = document.getElementById("add-customer__form").checkValidity();
    if (!isValidForm) {
        return false
    }

    event.preventDefault()
    let customer = {
        "id": customers.length + 1,
        "firstname": document.getElementById("firstname").value,
        "surname": document.getElementById("surname").value,
        "other-name": document.getElementById("other-name").value,
        "email": document.getElementById("email").value,
        "phone": document.getElementById("phone").value
    }

    customers.push(customer)
    localStorage.setItem("customers", JSON.stringify(customers))

    toggleCustomerShow()
    changePage(Number(document.querySelector(".pagination__item__active").innerHTML))
})