function appendNode(id) {
    let template = document.getElementById(`template-${id}`)
    let node = template.content.cloneNode(true)

    document.querySelector(".settings").appendChild(node)
    document.getElementById(`nav-${id}`).classList.add("item__selected")
}

function toggleAccount() {
    window.location.assign(window.location.pathname)
}

function togglePassword() {
    window.location.assign(window.location.pathname + "?section=password")
}

function toggleCompany() {
    window.location.assign(window.location.pathname + "?section=company")
}

function toggleVisibility(inputId) {
    let input = document.getElementById(inputId)
    const type = input.getAttribute("type") === "password" ? "text" : "password";
    input.setAttribute("type", type);

    let icon = document.getElementById(`toggle-${inputId}`)
    icon.classList.toggle("bi-eye");
}

(() => {
    let sections = {
        "password":"password",
        "company": "company"
    }
    let urlParams = new URLSearchParams(window.location.search)
    let section = urlParams.get("section")
    if (section === null || sections[section] === undefined) {
        appendNode("account")
        return
    }

    appendNode(sections[section])
})()