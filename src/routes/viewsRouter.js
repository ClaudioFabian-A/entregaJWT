import { Router } from "express";
import productManager from "../dao/mongoose/managers/productsManager.js";
import cartsManager from "../dao/mongoose/managers/cartsManager.js";


function Admin(req, res, next) {
    if (req.session?.Admin) {
        return next();
    }
    return res.status(401).send({ status: "error", error: "error en el usuario" });
}
function stoped(req, res, next) {
    if (req.session.user) { return next(); }

    return res.status(401).redirect("/login");
}
function stopedOf(req, res, next) {
    if (req.session.user) {
        res.redirect("/products")
        return res.status(401).send("error de autorizacion")
    }
    return next();
}

const prodManager = new productManager();
const cartManager = new cartsManager();
const router = Router();

router.get("/", stoped, async (req, res) => {
    // console.log(req);
    let user1 = req.user.firstName;
    // console.log(user1);
    let prodList = await prodManager.getProducts(req.query);
    res.render("home", {
        prodList: prodList.payload,
        user: user1,
    });

    console.log("prodLits");


});
router.get("/login", stopedOf, async (req, res) => {
    res.render("Login");
})
router.get("/register", stopedOf, async (req, res) => {
    res.render("Register");
})
router.get("/logout", async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            return res.redirect('/');
        } else {
            return res.redirect('/')
        }
    })
})
router.get("/realTimeProducts", Admin, async (req, res) => {
    // const prodList = await prodManager.getProducts();
    let user = req.user.firstName;
    res.render("realTimeProducts", { user: user });
})
router.get("/chat", stoped, (req, res) => {
    let user = req.user.firstName;

    res.render("chat", { user: user });
})
router.get("/carts/:cid", stoped, async (req, res) => {
    let user = req.user.firstName;
    let cid = req.params.cid;
    let cartList = await cartManager.getCartById(cid);
    res.render("cart", { products: cartList[0].products, user: user });
})
router.get("/products", stoped, async (req, res) => {
    let user = req.user.firstName;
    console.log(user);
    let prodList = await prodManager.getProducts(req.query);

    res.render("products", { products: prodList, user: user });
})
router.get("/", stopedOf, async (req, res) => {
    // console.log(req);
    if(!req.session.user){return res.redirect("/login")}
    
    res.render("profile", { user: req.session.user })
})
// router.get("/profile", async (req, res) => {
//     let user = ;

//     res.render("profile", {
//         user: user,

//     });
// });
router.get("/restore", async (req, res) => {
    res.render("restore", {

    });
});



export default router;