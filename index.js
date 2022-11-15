import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    loadHtml,
    adjustForMissingHash,
    setActiveLink,
    renderTemplate,

} from "./utils.js"

import {load as loadV2} from "./pages/page1/cars.js"

window.addEventListener("load", async () => {
    const templateHome = await loadHtml("./pages/homePage/homePage.html")
    const template404Error = await loadHtml("./pages/error/404.html")
    const templatePage1 = await loadHtml("./pages/page1/page1.html")
    const templatePage2 = await loadHtml("./pages/page2/page2.html")
    const templatePage3 = await loadHtml("./pages/page3/page3.html")
    const templatePage4 = await loadHtml("./pages/page4/page4.html")

    const router = new Navigo("/", {hash: true});
    window.router = router

    adjustForMissingHash()
    router
        .hooks({
            before(done, match) {
                setActiveLink("topnav", match.url)
                done()
            }
        })
        .on({
            "/": () => renderTemplate(templateHome, "content"),
            "/page1": (match) => {
                renderTemplate(templatePage1, "content")
                loadV2(1, match)
            },
            "/page2": (match) => {
                renderTemplate(templatePage2, "content")
            },
            "/page3": (match) => {
                renderTemplate(templatePage3, "content")
            },

            "/page4": (match) => {
                renderTemplate(templatePage4, "content")
            }
        })
        .notFound(() => renderTemplate(template404Error, "content"))
        .resolve()
});


window.onerror = (e) => alert(e)