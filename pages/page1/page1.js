import {URL1 as SERVER_URL} from "../../settings.js";
import {checkToken} from "../../login.js";

import {paginator} from "../../lib/paginator/paginate-bootstrap.js"
import {sanitizeStringWithTableRows} from "../../utils.js"

const SIZE = 13
const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend
//useBootStrap(true)

const navigoRoute = "page1"

let page1 = [];

let sortField = "kilometers";
let sortOrder = "desc"

let initialized = false

function handleSort1(pageNo, match) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc"
    sortField = document.getElementById("header-brand").innerText
    load(pageNo, match)
}

function handleSort2(pageNo, match) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc"
    sortField = document.getElementById("header-model").innerText
    load(pageNo, match)
}

function handleSort3(pageNo, match) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc"
    sortField = document.getElementById("header-color").innerText
    load(pageNo, match)
}

function handleSort4(pageNo, match) {
    sortOrder = sortOrder === "asc" ? "desc" : "asc"
    sortField = document.getElementById("header-kilometers").innerText
    load(pageNo, match)
}

async function filter(pg, match) {
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(`<tr><td colspan="5">Error: Du ikke logget ind</td></tr>`)
    if (!initialized) {
        document.getElementById("header-brand").onclick = function (evt) {
            evt.preventDefault()
            handleSort1(pageNo, match)
        }
        document.getElementById("header-model").onclick = function (evt) {
            evt.preventDefault()
            handleSort2(pageNo, match)
        }
        document.getElementById("header-color").onclick = function (evt) {
            evt.preventDefault()
            handleSort3(pageNo, match)
        }
        document.getElementById("header-kilometers").onclick = function (evt) {
            evt.preventDefault()
            handleSort4(pageNo, match)
        }
        initialized = true
    }
    let column = document.getElementById("column").value
    let value = document.getElementById("column-value").value
    const p = match?.params?.page || pg  //To support Navigo
    let pageNo = Number(p)

    let queryString = `?_sort=${sortField}&sort=${sortField},${sortOrder}&column=${column}&value=${value}&size=${SIZE}&page=` + (pageNo - 1)
    try {
        let newUrl = SERVER_URL + "/filter" + queryString
        page1 = await fetch(newUrl, await checkToken()).then(res => res.json())
        if (page1.length > 0) {
            const rows = page1.map(car => `
  <tr>
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")

            document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)
        }
    } catch (e) {
        console.error(e)
    }


    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: filter
    });
    //Update URL to allow for CUT AND PASTE when used with the Navigo Router
    //callHandler: false ensures the handler will not be called again (twice)
    window.router?.navigate(`/${navigoRoute}${queryString}`, {callHandler: false, updateBrowserURL: true})
}

async function onLoad(pg, match) {
    document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(`<tr><td colspan="5">Error: Du ikke logget ind</td></tr>`)
    if (!initialized) {
        document.getElementById("header-brand").onclick = function (evt) {
            evt.preventDefault()
            handleSort1(pageNo, match)
        }
        document.getElementById("header-model").onclick = function (evt) {
            evt.preventDefault()
            handleSort2(pageNo, match)
        }
        document.getElementById("header-color").onclick = function (evt) {
            evt.preventDefault()
            handleSort3(pageNo, match)
        }
        document.getElementById("header-kilometers").onclick = function (evt) {
            evt.preventDefault()
            handleSort4(pageNo, match)
        }
        initialized = true
    }
    const p = match?.params?.page || pg  //To support Navigo
    let pageNo = Number(p)

    let queryString = `?_sort=${sortField}&sort=${sortField},${sortOrder}&size=${SIZE}&page=` + (pageNo - 1)
    try {
        let newUrl = SERVER_URL + queryString
        page1 = await fetch(newUrl, await checkToken()).then(res => res.json())
        if (page1.length > 0) {
            const rows = page1.map(car => `
  <tr>
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")

            document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)
        }
    } catch (e) {
        document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(`<tr><td colspan="5">Kunne ikke finde ??nskede biler</td></tr>`)
        console.error(e)
    }


    // (C1-2) REDRAW PAGINATION
    paginator({
        target: document.getElementById("car-paginator"),
        total: TOTAL,
        current: pageNo,
        click: onLoad
    });
    //Update URL to allow for CUT AND PASTE when used with the Navigo Router
    //callHandler: false ensures the handler will not be called again (twice)
    window.router?.navigate(`/${navigoRoute}${queryString}`, {callHandler: false, updateBrowserURL: true})

}

export async function load(pg, match) {
    await onLoad(pg, match)

    document.getElementById("filter-btn").onclick = function (evt) {
        evt.preventDefault()
        if (document.getElementById("column-value").value.length <= 1) {
            onLoad(pg, match)
        } else if (document.getElementById("column-value").value.length > 1) {
            filter(pg, match)
        }
    }
    document.getElementById("reset-btn").onclick = function (evt) {
        evt.preventDefault()
        document.getElementById("column").value = ""
        document.getElementById("column-value").value = ""
        onLoad(pg, match)
    }
}

