document.querySelectorAll(".menu__item")
    .forEach(t => {
            if (t.href === document.location.origin + document.location.pathname)
            t.classList.add("menu__item__active")
    })

if (document.location.pathname==='/Web-5sem/') {
    document.querySelector(".menu__first-item").classList.add("menu__item__active")
}