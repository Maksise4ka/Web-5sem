function collapseMenu() {
    document.getElementById("content").classList.toggle("display-none")
    document.getElementById("menu").classList.toggle("menu__collapse")

    document.querySelectorAll(".menu__item-description")
        .forEach(i => {
            i.classList.toggle("menu__description__collapse")
        })

    document.querySelectorAll(".menu__item-icon")
        .forEach(i => {
            i.classList.toggle("menu__item-icon__collapse")
        })

    document.getElementById("fold-menu").classList.toggle("display-button")
    document.getElementById("unfold-menu").classList.toggle("display-button")
}