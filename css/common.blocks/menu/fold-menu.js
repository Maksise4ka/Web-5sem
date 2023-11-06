function foldMenu() {
    document.getElementById("content").classList.toggle("display-none")

    document.querySelectorAll(".menu__description")
        .forEach(i => {
            i.classList.toggle("menu__description__collapse")
        })

    document.getElementById("fold-menu").classList.toggle("display-button")
    document.getElementById("unfold-menu").classList.toggle("display-button")
}