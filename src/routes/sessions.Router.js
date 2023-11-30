import { Router } from "express";
import UserManager from '../dao/mongoose/managers/UserManager.js';
import passport from "passport";
import { generateToken, authToken } from "../utils.js"


const router = Router();
const usersServices = new UserManager();



router.get('session/login', passport.authenticate('login'), async (req, res) => {
    if (!req.user)
        return res.status(400).send({ status: "error", message: "Invalid Credentials" });
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        admin: req.user.admin,
    };
    delete req.user.password;
    const access_Token = generateToken(req.user);
    res.send({ status: "success", access_Token, datos: req.user });

});
router.get("/session/current", authToken, (req, res) => {
    res.send({ status: "success", datos: req.user });
});
router.post('/register', async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
    } = req.body;
    if (!firstName || !lastName || !email || !password) return res.status(400).send({ status: "error", error: "incomplete fields" });
    const user = await usersServices.getBy({ email });

    if (user) {
        return res.status({ status: "error", error: "error de sessionrouter" }).redirect('/login')
    } else {

        const newUser = {
            firstName,
            lastName,
            email,
            password
        }
        const result = await usersServices.create(newUser);
        res.send({ status: "success", payload: result._id });
    }


})
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "email or password empty" });
    const user = await usersServices.getBy({ email, password })
    if (!user) return res.status(400).send({ status: "error", error: "invalid users" });
    req.session.user = user;
    res.send({ status: "success", message: "logued" });
    return res.redirect('/products');
})
router.get('/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.log(error);
            return res.redirect("/");
        } else {
            res.redirect("/");
        }
    });
})
router.get('/session/github', passport.authenticate("github", { scope: "user:email" }), async (req, res) => { });
router.get('/session/gitCallback', passport.authenticate('github', { failureRedirect: "/session/login" }), async (req, res) => {
    req.session.user = {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        admin: req.user.admin,
    };
    const access_Token = generateToken(req.user);
    res.redirect('/products');
})
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
})
router.post("/session/restore", async (req, resp) => {
    let { user, password } = req.query;
    let logUser = await UM.restore(user, password);
    delete logUser.password;
    if (logUser == "invalidUser") {
      resp.status(400).send({ status: "ERROR", message: "Usuario incorrecto" });
    } else {
      req.session.users = logUser;
      resp.send({
        status: "OK",
        message: "Clave modificada exitosamente ",
        datos: logUser,
      });
    }
  });
export default router;