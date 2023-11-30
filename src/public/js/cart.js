//hago la multiplicacion de dos campos para el total

window.onload = function () {
    itemCart();
    let TPrice = document.getElementsByClassName("totalPrice");
    // console.log(document.getElementsByClassName("price"));
    for (i in TPrice) {
        let idArt = TPrice[i].id;
        let price = document.getElementById(`p${idArt}`);
        let acount = document.getElementById(`q${idArt}`);
        TPrice[i].innerHTML =
            Number(price.innerHTML) * Number(acount.innerHTML);
    }
};



let counter = 0;
let counterCart = document.getElementById("numeroCarrito");

async function itemCart() {
    let user = await JSON.parse(sessionStorage.getItem("counter"));
    let idCart = "";
    if (user) {
        idCart = await user;
        let idCartParams = await fetch(`/api/carts/${idCart}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let arts = await idCartParams.json();
        let artsList = await arts[0].products;
        counter = artsList.length;
    } else {
        idCart = window.location.pathname.split("/")[2];
        let idCartParams = await fetch(`/api/carts/${idCart}`, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
            },
        });
        let arts = await idCartParams.json();
        let artsList = await arts[0].products;
        counter = artsList.length;
    }
    counterCart.innerHTML = counter;
}
async function adios() {
    try {
        let logout = await fetch(`/api/session/logout`, {
            method: "get",
        });
        // console.log("Sesion eliminada");
        // sessionStorage.removeItem("carrito");
        // location.href = "http://localhost:8080/";
        return window.location = "/";
    } catch (error) {
        console.log(error);
    }
}

let logoutElement = document.getElementById("logout");
logoutElement.onclick = adios;
