window.addEventListener('load', () => {
    let element = document.getElementById("page-load");
    let loadTime = window.performance.getEntriesByType("navigation")[0]["domComplete"];
    let txt = document.createTextNode(`Page load: ${Math.round(loadTime)}ms`);
    element.appendChild(txt)
});
