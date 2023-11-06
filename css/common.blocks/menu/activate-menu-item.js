document.querySelectorAll(".menu__item")
    .forEach(t => {
        if (t.href === document.location.origin + document.location.pathname)
            t.classList.add("menu__item__active")
    })