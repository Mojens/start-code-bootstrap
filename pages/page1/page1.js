import {URL1 as SERVER_URL} from "../../settings.js";

import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 10
const TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend
//useBootStrap(true)

const navigoRoute = "page1"

let page1 = [];

let sortField;
let sortOrder = "desc"

let initialized = false

function handleSort(pageNo, match) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc"
  sortField = "brand"
  load(pageNo, match)
}

export async function load(pg, match) {
  //We dont wan't to setup a new handler each time load fires
  if (!initialized) {
    document.getElementById("header-brand").onclick = function (evt) {
      evt.preventDefault()
      handleSort(pageNo, match)
    }
    initialized = true
  }
  const p = match?.params?.page || pg  //To support Navigo
  let pageNo = Number(p)

  let queryString = `?_sort=${sortField}&_order=${sortOrder}&_limit=${SIZE}&_page=` + (pageNo - 1)
  try {
    page1 = await fetch(`${SERVER_URL}${queryString}`)
      .then(res => res.json())
  } catch (e) {
    console.error(e)
  }
  const rows = page1.map(car => `
  <tr>
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")


  document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

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