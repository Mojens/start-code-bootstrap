import {URL1 as SERVER_URL} from "../../settings.js";
import {checkToken2} from "../../login.js";

let router;

export function load(navigoRouter) {
    document.getElementById("createSubmitBtn").onclick = addObject;
    router = navigoRouter;
}


async function addObject(){
    const attribute1 = document.getElementById("input1").value;
    const attribute2 = document.getElementById("input2").value;
    const attribute3 = document.getElementById("input3").value;
    const attribute4 = document.getElementById("input4").value;
    const attribute5 = document.getElementById("input5").value;

    const object = {
        id: attribute1,
        brand: attribute2,
        model: attribute3,
        color: attribute4,
        kilometers: attribute5
    };

    await fetch(SERVER_URL,await checkToken2(object))
        .then((res) => res.json())
        .then((data) =>
            document.getElementById("responseText").innerHTML = 'Tilføjet bil med id: ' + data.id
           ).then(() => window.navigate("/page1/"));
}