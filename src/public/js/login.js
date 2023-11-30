const form = document.getElementById('loginForm');

form.addEventListener('submit', async e => {
    console.log(e);
    e.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })
    // form.addEventListener('submit', async e => {
    //     e.preventDefault();
    //     const data = new FormData(form);
    //     const obj = {};
    //     data.forEach((value, key) => obj[key] = value);
    //     const response = await fetch('/api/sessions/login', {
    //         method: 'POST',
    //         body: JSON.stringify(obj),
    //         headers: {
    //             "Content-Type": 'application/json'
    //         }
    //     })
    const result = await response.json();
    const resultStatus = result.status;
    if (await resultStatus == 200) {
        window.location.replace('/');
    }
    console.log(result);
})
let logButton = document.getElementById("logButton");
logButton.onclick = (e) => {
    e.preventDefault();
    login();
};
let gitButton = document.getElementById("gitButton");
gitButton.onclick = (e) => {
    e.preventDefault();
    location.href = "/api/sessions/github";
};
async function login() {
    let user = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let userFetch = await fetch(
        `http://localhost:8080/api/session/login?email=${user}&password=${password}`,
        {
            method: "get", headers: {
                "Content-type": "application/json",
            },
        });
    let userFetchOk = await userFetch.json();
    if ((await userFetchOk.status) =="Error") {
        // let alert = document.getElementById("alert");
        // alert.innerHTML = await userFetchOk.message;
        res.send({ status: "error", error: "error login.js" })
    } else {
        let userLogued = document.getElementById("user");
        userLogued.innerHTML = await userFetchOk.data.firstName;
        window.location.href="/products";

    }
    return userFetchOk;
}

