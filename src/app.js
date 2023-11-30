import express from "express";
import expressHandlebars from "express-Handlebars";
import Handlebars from 'handlebars';
import productRouter from "./routes/productsRouter.js";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import cartRouter from "./routes/cartsRouter.js";
import __dirname from "./utils.js";
import viewsRouter from './routes/viewsRouter.js';
import { Server } from "socket.io";
import ProductManager from "./dao/mongoose/managers/productsManager.js";
import mongoose from 'mongoose';
import ChatManager from "./dao/mongoose/managers/chatManager.js";
import chatRouter from "./routes/chatRouter.js";
import cookieParser from "cookie-parser";
import sessionRouter from './routes/sessions.router.js';
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initiliazePassport from "./config/passportConfig.js";

// import { v4 as uuidv4 } from 'uuid';


const PORT = process.env.PORT || 8080;
const app = express();

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto: ${PORT}`);

});
const socketServer = new Server(httpServer);

mongoose.connect("mongodb+srv://gonzalezclaudiofabian3:Luz1567842242@cluster0.obkcdqv.mongodb.net/entregaJWTdesdeCero?retryWrites=true&w=majority")

console.log(`base en linea`);
app.use(express.static(__dirname+`public`));
app.engine("handlebars", expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
}));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://gonzalezclaudiofabian3:Luz1567842242@cluster0.obkcdqv.mongodb.net/entregaJWTdesdeCero?retryWrites=true&w=majority",
        ttl: 200000,
    }),
    secret: 'claudio',
    resave: false,
    saveUninitialized: false,
   
}))
initiliazePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use('/', viewsRouter);
app.use("/api", productRouter);
app.use("/api", cartRouter);
app.use("/", chatRouter);
app.use('/api', sessionRouter);
app.use(cookieParser());
app.get("/setCookie", (req, res) => {
    res.cookie('cookieEntrega', 'cookie de la entrega', { maxAge: 10000 }).send("cookie")
})
socketServer.on("connection", async (socket) => {
    let prodManager = new ProductManager();
    const prodList = await prodManager.getProducts({
        limit: "",
        page: "",
        query: "",
        sort: "",
    });
    let chatManager = new ChatManager();
    let chat = await chatManager.getMessages();
    console.log("Cliente conectado con id: ", socket.id);
    socketServer.emit("prodList", prodList);
    socketServer.emit("message", chat);
    socket.on("updateProduct", async (product) => {
        let prodManager = new ProductManager()
        await prodManager.addProduct(
            product.title,
            product.description,
            product.category,
            product.price,
            product.thumbnail,
            product.code,
            product.stock
        )

        let prodList = await prodManager.getProducts({
            limit: "",
            page: "",
            query: "",
            sort: "",
        });
        socketServer.emit("prodList", prodList);
    });

    socket.on("articleDeleted", async (id) => {
        let prodManager = new ProductManager();

        await prodManager.deleteProduct(id);
        let newProdList = new ProductManager()

        let prodList = await newProdList.getProducts({
            limit: "",
            page: "",
            query: "",
            sort: "",
        });
        socketServer.emit("prodList", prodList);
    });

    socket.on("disconnected", () => {
        console.log("Cliente desconectado");
    });
    socket.on("newUser", (userValue) => {
        console.log("userValue", userValue);
        socket.broadcast.emit("bCast", userValue);
    });
    socket.on("disconnected", () => {
        console.log(`user ${socket.id} desconectado`);
    });
    socket.on("message", async (data) => {
        console.log(data);
        await chatManager.createMessage(data);
        socketServer.emit("pChat", await chatManager.getMessages())
    })
});










