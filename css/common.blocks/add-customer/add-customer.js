import {displayPagination, getCurrentPage} from "../pagination/pagination.js";

function getFetchPages() {
    return 10
}

function getCustomersPerPage() {
    return 12
}

function getTotalPages() {
    let customers = JSON.parse(localStorage.getItem("customers"))
    let len;
    if (customers === null)
        len = 0
    else
        len = customers.length

    let customersPerPage = getCustomersPerPage()
    return Math.ceil(len / customersPerPage) + getFetchPages()
}

(() => {
    document.querySelector(".customers-menu__add-button").addEventListener('click', toggleCustomerShow)
    document.querySelector(".add-customer__close-button").addEventListener('click', toggleCustomerShow)

    let currentPage = getCurrentPage(getTotalPages())
    displayPagination(getTotalPages())

    window.addEventListener('load', function () {
        if (currentPage <= getFetchPages()) {
            fetchCustomers(currentPage)
        } else {
            displayFromLocalStorage()
        }
    })
})()

function displayError() {
    document.querySelector(".customer-menu__error").classList.remove("customer-menu__error__hide")
    document.querySelector(".customers-menu__content").classList.add("customers-menu__content-error")
}

// function hideError() {
//     document.querySelector(".customer-menu__error").classList.add("customer-menu__error__hide")
//     document.querySelector(".customers-menu__content").classList.remove("customers-menu__content-error")
// }

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
    let customersPerPage = getCustomersPerPage()

    customers
        .slice((activatedPage - 1) * customersPerPage, activatedPage * customersPerPage)
        .forEach(c => displayCustomer(c))

    hideLoading()
}

function fetchCustomers(pageNumber) {
    displayLoading()
    let query = fetch(`https://randomuser.me/api/?results=${getCustomersPerPage()}&page=${pageNumber}`)
    query
        .then(data => data.json())
        .then(d => {
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
    location.reload();
})