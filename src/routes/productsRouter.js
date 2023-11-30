import { Router } from "express";
import ProductManager from "../dao/mongoose/managers/productsManager.js";



const prodManager = new ProductManager();
const productRouter = Router();


productRouter.get("/products", async (req, res) => {

    const products = await prodManager.getProducts(req.query);
    //console.log(products);
    res.send( products )
    // console.log(products);

});
productRouter.get("/products/:pid", async (req, res) => {
    let pid = req.params.pid;
    if (pid == undefined) { res.send(await prodManager.getProducts()) } else {
        let resp = await prodManager.getProductById(pid);
        if (resp == false) { res.send("id not found"); } else { res.send(await productManager.getProductById(pid)) }
    }
})
productRouter.post("/products/", async (req, res) => {
    let {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock
    } = req.body;
    let prodList = await prodManager.addProduct(
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock
    );
    if (prodList == "emptyvalues") {
        res.status(400).send({ status: "error", error: "uncomplete vaules" })
    } else if (prodList == "repeatvalue") {
        res.status(400).send({ status: "error", error: "repeat values" })
    } else {
        res.status(200).send("ok")
    }
});
productRouter.put("/products/:pid", async ( req,res)=>{
    const id = req.params.pid;
    let {
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock
    }=req.body;
    let prodList= await prodManager.updateProduct(
        id,
        title,
        description,
        category,
        price,
        thumbnail,
        code,
        stock
    );
    if( prodList == "emptyvalue"){
        res.status(400).send({status:"error",error:"empty values"})
    }else if(prodList== "codeRepetido" ){
res.status(400).send( {status:"error", error:"dual code"})
    }else{
        res.status(200).send("ok")
    }
});
productRouter.delete("/products/:pid", async( req,res)=>{
const id= req.params.pid;
let prodList = await prodManager.deleteProduct(id);
if ( prodList ){
    res.status(200).send("ok")
}else{
    res.status(400).send({status:"error",error:"not deleted"})
}
})




// router.post("/carts/:cid/products/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const { quantity } = req.body;
//     const addedArts = await productsServices.addPCartWithId(cid, pid, quantity);
//     if ((await addedArts) == "artAdded") {
//         res.send("art added to cart")
//     } else if ((await addedArts) == "artNotAdded") {
//         res.status(500).send({ status: "error", payload: "arID not Found" });
//     } else {
//         res.status(500).send({ status: "error", payload: "cartID not found" });
//     }
// });
// router.put("/carts/:cid/products/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const { quantity } = req.body;
//     const addArts = await productsServices.addPCartWithId(cid, pid, quantity);
//     if ((await addArts) == "artAdded") {
//         res.send("added art")
//     } else if ((await addArts) == "artNotAdded") {
//         res.status(500).send({ status: "error", payload: "error product manager M" });
//     } else {
//         res.status(500).send({ status: "error", payload: "error products router N" });

//     }

// });
// router.put("/carts/:cid", async (req, res) => {

//     const cid = req.params.cid;
//     const product = req.body;
//     const addCart = await productsServices.addCart(cid, product);
//     if ((await addCart) == "updatedcart") {
//         res.send("adeddCart")

//     } else if ((await addCart) == "failedupdate") {
//         res.status(500).send({ status: "error", payload: "error produc Router O" });

//     } else {
//         res.status(500).send({ status: "error", payload: "error product router P" });
//     }


// });
// router.delete("/carts/:cid", async (req, res) => {
//     let cid = req.params.cid;
//     const deleteProdInCartProduct = await productsServices.deleteProdInCartProduct(cid);
//     if ((await deleteProdInCartProduct) == "deletedarticles") {
//         res.send("deleted articles");
//     } else {
//         res.status(500).send({ status: "error", payload: "error product manager O" })
//     }

// });
// router.delete("/carts/:cid/product/:pid", async (req, res) => {
//     const cid = req.params.cid;
//     const pid = req.params.pid;
//     const deleteCartProduct = await productsServices.deleteCartProduct(cid, pid);
//     if ((deleteCartProduct) == "deletedarticle") {
//         res.send("deleted article");
//     } else if ((deleteCartProduct) == "artnotfound") {
//         res.status(500).send({ status: "error", payload: "error product router P" });
//     } else {
//         res.status(500).send({ status: "error", payload: "error product router Q" });
//     }
// });


export default productRouter;
