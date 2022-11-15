import {URL1 as SERVER_URL} from "../../settings.js";

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
    const attribute6 = document.getElementById("input6").value;

    const object = {
        attribute1,
        attribute2,
        attribute3,
        attribute4,
        attribute5,
        attribute6
    };

    await fetch(SERVER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(object),
    })
        .then((res) => res.json())
        .then((data) => data.id);
}