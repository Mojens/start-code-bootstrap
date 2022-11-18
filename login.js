import {URL2 as AUTH_URL} from './settings.js';
import { sanitizeStringWithTableRows } from "./utils.js"
import{load as load1} from './pages/page1/page1.js'


document.getElementById("btn-login").onclick = loginLogoutClick
document.getElementById("btn-logout").onclick = loginLogoutClick
//document.getElementById("page1").onclick = handlePage1Click()

const userNameInput = document.getElementById("input-user")
const passwordInput = document.getElementById("input-password")
const loginContainer = document.getElementById("login-container")
const logoutContainer = document.getElementById("logout-container")

async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const error = new Error(errorResponse.message)
        error.apiError = errorResponse
        throw error
    }
    return res.json()
}

function changeNav(){
    const token = localStorage.getItem("token")
    const roles = localStorage.getItem("roles")
    if (token) {
        if (roles.includes("ADMIN")) {
            document.getElementById("page1").style.display = "block"
            document.getElementById("page2").style.display = "block"
            document.getElementById("page3").style.display = "block"
            document.getElementById("page4").style.display = "block"
        }else if (roles.includes("USER")) {
            document.getElementById("page1").style.display = "block"
            document.getElementById("page2").style.display = "none"
            document.getElementById("page3").style.display = "none"
            document.getElementById("page4").style.display = "none"
        }
    }else
    {
        document.getElementById("page1").style.display = "none"
        document.getElementById("page2").style.display = "none"
        document.getElementById("page3").style.display = "none"
        document.getElementById("page4").style.display = "none"
    }

}

function toogleLoginStatus(loggedIn) {
    loginContainer.style.display = loggedIn ? "none" : "block"
    logoutContainer.style.display = loggedIn ? "block" : "none"
}

function storeLoginDetails(res) {
    localStorage.setItem("token", res.token)
    localStorage.setItem("user", res.username)
    localStorage.setItem("roles", res.roles)
    //Update UI
    toogleLoginStatus(true)
}
function clearLoginDetails() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("roles")
    //Update UI
    toogleLoginStatus(false)
}
async function loginLogoutClick(evt) {
    evt.stopPropagation()  //prevents the event from bubling further up
    const logInWasClicked = evt.target.id === "btn-login" ? true : false
    if (logInWasClicked) {
        //Make the request object
        const loginRequest = {}
        loginRequest.username = userNameInput.value
        loginRequest.password = passwordInput.value
        const options = {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(loginRequest)
        }
        try {
            const res = await fetch(AUTH_URL + "/login", options).then(handleHttpErrors)
            storeLoginDetails(res)
            changeNav()
            load1()
        } catch (err) {
           console.log(err)
            if (err.apiError) {
               console.log(err.apiError.message)
            } else {
                console.log(err.message)
            }
        }
    } else {
        //Logout was clicked
        clearLoginDetails()
        load1()
        changeNav()
    }
}

async function fetchDataAndUpdateUI(url, addToken) {
    const options = {
        method: "GET",
        headers: { "Accept": "application/json" }
    }
    if (addToken) {
        const token = localStorage.getItem("token")
        if (!token) {
            alert("You must login to use this feature")
            return
        }

        options.headers.Authorization = "Bearer " + token
    }

    try {
        const res = await fetch(url, options).then(handleHttpErrors)
        alert(res.info)
    } catch (err) {
        if (err.apiError) {
            alert(err.apiError.message)
        } else {
            alert(err.message)
        }

    }
}