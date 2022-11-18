import {URL2 as AUTH_URL} from './settings.js';

document.getElementById("btn-login").onclick = loginLogoutClick
document.getElementById("btn-logout").onclick = loginLogoutClick

const userNameInput = document.getElementById("input-user")
const passwordInput = document.getElementById("input-password")
const loginContainer = document.getElementById("login-container")
const logoutContainer = document.getElementById("logout-container")
const userDetails = document.getElementById("user-details")

async function handleHttpErrors(res) {
    if (!res.ok) {
        const errorResponse = await res.json();
        const error = new Error(errorResponse.message)
        error.apiError = errorResponse
        throw error
    }
    return res.json()
}

function toogleLoginStatus(loggedIn) {
    loginContainer.style.display = loggedIn ? "none" : "block"
    logoutContainer.style.display = loggedIn ? "block" : "none"
    const statusTxt = loggedIn ? `User: ${localStorage["user"]} (${localStorage["roles"]})` : ""
    userDetails.innerText = statusTxt
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
    }
}