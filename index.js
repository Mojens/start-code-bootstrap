import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadHtml,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { load as loadV2 } from "./pages/page1/cars.js"

window.addEventListener("load", async () => {
  const templateHome = await loadHtml("./pages/home/home.html")
  const templateCarsBootstrap = await loadHtml("./pages/page1/page1.html")

  const router = new Navigo("/", { hash: true });
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
        renderTemplate(templateCarsBootstrap, "content")
        loadV2(1, match)
      }
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)