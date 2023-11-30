import { Router } from "express";
import cartsManager from "../dao/mongoose/managers/cartsManager.js";

// import { __dirname } from "../utils.js";



const CManager = new cartsManager();
const cartRouter = Router();


cartRouter.get("/carts", async (req, res) => {
    res.send(await CManager.getOllCart());
})
cartRouter.post("/carts/", async (req, res) => {
    let cartCreate = await CManager.createNewCart();

    if (cartCreate) {
        res.send(cartCreate);
    } else {
        res.status(500).send({ status: "error", error: "cannot create the cart" });
    }

})
cartRouter.delete("/carts/:cid", async (req, res) => {
    let cartsId = req.params.cid;
    const deletedCart = await cartsManager.deletedCart(cartsId);
    deletedCart ? res.send("deleted card") : res.status(500).send({ status: "error", payload: "deleted failed" })


})
cartRouter.delete("/carts/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const deletedProduct = await CManager.deleteCartProduct(cid, pid);
    if ((await deletedProduct) == "delete article") {
        res.send("deleted article");
    } else if ((await deletedProduct) == "art not found") {
        res.status(500).send({ status: "error", message: "article not found" });
    } else {
        res.status(500).send({ status: "error", message: "cart not found" });
    }
})
cartRouter.get('/carts/:cid', async (req, res) => {
    let cid = req.params.cid;
    if (cid == undefined) {
        res.status(500).send({ status: "error", error: "cid, undefined" })
    } else {
        let res = await CManager.getCartById(cid);
        if (res == false) {
            res.status(500).send({ status: "error", error: "cid inexistente" })
        } else {
            res.send(await resp);
        }
    }
});
//     const carts = await CManager.getCartById(cartsId);
//     carts ? res.send(await carts) : res.status(500).send({ status: "error", payload: `not a cart` })
// })
cartRouter.post('/', async (req, res) => {
    const cart = await CManager.addCart();
    cart ? res.status(201).json({ message: `Cart creada con exito`, cart }) : res.status(400).json({ message: `Error al crear el Cart`, cart })
})
cartRouter.post('/carts/:cid/products/:pid', async (req, res) => {

    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const addArtS = await CManager.addPCartWithId(cid, pid, quantity);
    if ((await addArtS) == "artAdded") {
        res.status(201).send({ message: "producto agregado con exito" })
    } else if ((await addArtS) == "artNotAdded") {

        console.log("Error al cargar el producto", error);
        res.status(525).send({ message: `error al cargar el cart` })
    } else {
        res.status(500).send({ status: "error", error: "cartNotFound" })
    }
})
cartRouter.put('/carts/:cid', async (req, res) => {
    const cid = req.params.cid;
    const product = req.body;
    const plusArts = await cartsManager.addCart(cid, product);
    if ((await plusArts) == "updatedcart") {
        res.send("art added ")
    } else if (plusArts == "failedupdate") {
        rs.status(500).send({ status: "error", error: " article not added" })

    } else {
        res.status(500).send({ status: "error", error: "error" })
    }
})
cartRouter.put("/carts/:cid/product/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const plusArts = await cartsManager.addPCartWithId(cid, pid, quantity);
    if ((await plusArts) == "artAdded") {
        res.send("ok added")
    } else {
        res.status(500).send({ status: "error", error: "artNotAdded" });
    }

})

export default cartRouter;