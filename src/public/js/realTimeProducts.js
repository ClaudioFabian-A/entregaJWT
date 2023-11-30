const socket = io();

let idForm = document.getElementById("idForm");
idForm.addEventListener("click", (e) => { e.preventDefault(); });

function idFormEvent() {
    let title = idForm.elements.title.value;
    let description = idForm.elements.description.value;
    let stock = idForm.elements.stock.value;
    let thumbnail = idForm.elements.stock.value;
    let category = idForm.elements.stock.value;
    let price = idForm.elements.stock.value;
    let code = idForm.elements.code.value;
    const attributes = { title, description, stock, thumbnail, category, price, code };
    socket.emit("updateProduct", attributes);
    // console.log(attributes);
    idForm.reset();
};
function deleteArticle() {
    let deleteArticle = document.getElementsByClassName("deleteButton");
    let idArt = null;
    for (i in deleteArticle) {
        deleteArticle[i].onclick = (e) => {
            idArt = e.target.attributes.id.nodeValue;
            articleDeleted(idArt);
        };

    }

}
function articleDeleted(idArt) {
    socket.emit("articleDeleted", idArt);
}
const prodForm = document.getElementById("idForm");
prodForm.addEventListener("click", (elements) => {
    elements.preventDefault();
});
function submitHandlebars() {

    let title = prodForm.elements.title.value;
    let description = prodForm.elements.description.value;
    let stock = prodForm.elements.stock.value;
    let thumbnail = prodForm.elements.thumbnail.value;
    let category = prodForm.elements.category.value;
    let price = prodForm.elements.price.value;
    let code = prodForm.elements.code.value;

    const dataSubmit = {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,

    };
    socket.emit("updateProduct", dataSubmit);
    prodForm.reset();
};

socket.on("prodList", (data) => {
    const containerBody = document.getElementById("containerBody");
    let products = "";
    data.payload.forEach((e) => {
        products += `
        <tr key=${e._id}>
        <td>${e._id}</td>
        <td>${e.title}</td>
        <td>${e.description}</td>
        <td>${e.category}</td>
        <td>${e.price}</td>
        <td>${e.thumbnail}</td>
        <td>${e.code}</td>
        <td>${e.stock}</td>
        <td>${e.status}</td>
        <td><button id="${e._id}" class="deleteButton">🗑️</button></td></tr>`;
    });
    containerBody.innerHTML = products;
    deleteArticle();
});
// socket.on("prodList", (data) => {
//     const dataList = document.getElementById("container")
// });
// function deleteArticle(idArt) {
//     sock.emit("deletElement", idArt);
// }
// document.getElementById("buttonSubmitDelete").addEventListener("click", (e) => {
//     const deletePid = document.getElementById("pid");
//     const deleteId = parseInt(deletePid.value);
//     socketClient.emit("deleteById", deleteId);
//     deletePid.value = "";
//     Swal.fire({
//         position: "top",
//         icon: "success",
//         title: "borrado",
//         showConfirmButton: false,
//         timer: 2000,
//     });
// });
// console.log('listo');
// console.log(socket);