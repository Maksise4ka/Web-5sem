function unfoldMenu() {
    let menu = document.getElementById("menu")
    menu.classList.remove("menu__fold")
    menu.classList.remove("menu__collapse")
    menu.classList.add("menu__unfold")

    document.querySelector(".menu__nav").classList.add("menu-nav__unfold")

    document.querySelectorAll(".menu__item-description").forEach(x => {
        x.classList.remove("menu__item-description__fold")
        x.classList.remove("menu__description__collapse")
    })

    document.querySelectorAll(".menu__item-icon").forEach(x => {
        x.classList.remove("menu__item-icon__fold")
        x.classList.remove("menu__item-icon__collapse")
    })

    document.getElementById("content").classList.remove("display-none")

    document.querySelector(".layout-content").classList.add("layout__background")
    document.querySelector(".layout-overlay").classList.add("layout-overlay__display")
}

function foldMenu() {
    let menu = document.getElementById("menu")
    document.querySelectorAll(".menu__item-description").forEach(x => x.classList.add("menu__item-description__fold"))
    document.querySelectorAll(".menu__item-icon").forEach(x => x.classList.add("menu__item-icon__fold"))

    document.querySelector(".menu__nav").classList.remove("menu-nav__unfold")
    menu.classList.remove("menu__unfold")
    menu.classList.add("menu__fold")

    document.querySelector(".layout-content").classList.remove("layout__background")
    document.querySelector(".layout-overlay").classList.remove("layout-overlay__display")


    document.getElementById("fold-menu").classList.add("display-button")
    document.getElementById("unfold-menu").classList.remove("display-button")
}

window.addEventListener('click', function (e) {
    let menu = document.getElementById("menu")
    if (!menu.contains(e.target) && !e.target.matches(".unfold-menu__button")) {
        foldMenu()
    }
})

let x = window.matchMedia("(max-width: 46.875rem)")
x.addEventListener('change', _ => {
    let menu = document.getElementById("menu")
    if (menu.classList.contains("menu__unfold")) {
        foldMenu()
    }
})