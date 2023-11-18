(() => {
    let customers = JSON.parse(localStorage.getItem("customers"))
    let len;
    if (customers === null)
        len = 0
    else
        len = customers.length
    len = 30
    let customersPerPage = 3 * 3
    let totalPages = Math.ceil(len / customersPerPage)

    // let activeNumber = Number(document.querySelector(".pagination__item__active").innerHTML)
    let activeNumber = 1
    let paginationList = document.querySelector(".pagination-list")
    for (let i = 1; i < totalPages + 1; ++i) {
        let template = document.getElementById("pagination__item-template")
        let page = template.content.cloneNode(true)
        paginationList.appendChild(page)
        page = paginationList.lastElementChild

        page.onclick = () => changePage(i)
        page.innerHTML = i.toString()
        if (i === activeNumber) {
            page.classList.add("pagination__item__active")
            // console.log(page)
        }
    }
})()

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
    displayCustomersOnPage()
})

function displayCustomersOnPage() {
    let customers = JSON.parse(localStorage.getItem("customers"))
    let activatedPage = Number(document.querySelector(".pagination__item__active").innerHTML)
    // activatedPage = 1
    let itemsPerPage = 3*3

    let customersMenu = document.getElementById("customers-menu")
    customersMenu.childNodes.forEach(child => {
        if (child.classList !== undefined) {
            if (child.classList.contains("customer")) {
                child.remove()
            }
        }
    })

    customers
        .slice((activatedPage - 1) * itemsPerPage, activatedPage * itemsPerPage)
        .forEach(c => displayCustomer(c))

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
}

function changePage(pageNumber){
    document.querySelectorAll(".pagination__item").forEach(e => {
        if (Number(e.innerHTML) === pageNumber) {
            e.classList.add("pagination__item__active")
        }
        else {
            e.classList.remove("pagination__item__active")
        }
    })

    displayCustomersOnPage()
}