function showDropdown() {
    document.querySelector(".heading__dropdown").classList.toggle("dropdown-show")
}

window.addEventListener('click', function (e) {
    let main = document.querySelector(".heading__profile")
    if (!main.contains(e.target)) {
        let dropdowns = document.getElementsByClassName("heading__dropdown");
        for (let i = 0; i < dropdowns.length; i++) {
            let openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('dropdown-show')) {
                openDropdown.classList.remove('dropdown-show');
            }
        }
    }
})