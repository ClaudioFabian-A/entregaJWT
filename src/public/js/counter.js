let counter = 0;
let counterCart = document.getElementById("numeroCarrito")

async function itemsCarts() {
    let user = await JSON.parse(sessionStorage.getItem("counter"));
    let idCart = "";
    if (user) {
        idCart = await user;
        let idCartParams = fetch(`/api/cart/${idCart}`, { method: "get", headers: { "Content-type": "application/json", }, });
        let arts = await idCartParams.json();
        let artsList = await arts[0].products;
        counter = artsList.length;
    } else { counter = 0; }
    counterCart.innerHTML = counter;
}
itemsCarts();
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
