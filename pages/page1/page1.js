import {URL1 as SERVER_URL} from "../../settings.js";

import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 13
const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend
//useBootStrap(true)

const navigoRoute = "page1"

let page1 = [];

let sortField="kilometers";
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

export async function load(pg, match) {
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
    const options = {
      method: "GET",
      headers: { "Accept": "application/json" }
    }
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("You must login to use this feature")
        return
      }
      options.headers.Authorization = "Bearer " + token
    }
    page1 = await fetch(newUrl,options).then(res => res.json())
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
    click: load
  });
  //Update URL to allow for CUT AND PASTE when used with the Navigo Router
  //callHandler: false ensures the handler will not be called again (twice)
  window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
}