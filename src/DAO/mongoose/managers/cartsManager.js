
import productManager from './productsManager.js';
import { cartModel } from '../models/cartsModels.js';
//import { v4 as uuidv4 } from 'uuid';
// console.log(uuidv4());

const ProductManager = new productManager();
class cartsManager {
    constructor() {

        this.carts = "";

    }
    async getOllCart() {
        let cart = [];
        try {
            cart = await cartModel.find().lean();
        } catch (error) {
            console.log(error);

        }
        return await cart;
    }
    async getCartById(id) {
        try {
            const serCart = await cartModel.find({ _id: id });
            return await serCart;
        } catch (error) {
            return false;
        }
    }
    async createNewCart() {
        let cart = { products: [] }
        let newCart = await cartModel.create(cart);
        return newCart;
    };
    async upDateCartWithId(cid, pid, quantity) {
        const idCart = await this.getCartById(cid);
        const prdQuantity = quantity ? quantity : 1;
        let art = await idCart[0];
        if (art) {
            const idProd = await art.products.find((e) => e.product._id == id);
            if (idProd) {
                let arts = await art.products;
                let artIndex = await arts.findIndex((e) => e.product._id == pid);
                arts[await artIndex].quantity = prdQuantity;
                await cartModel.updateOne({ _id: cid }, { products: arts });
                return "productoactualizado";
            } else {
                return "pidNotFound";
            }
        } else { return "cidNotFound" }
        // return cartModel.updateOne({ _id: id }, { $set: cart });
    }
    async deleteCartWithId(cid) {
    }
    async deleteCartProduct(cid, pid) {
        const idCart = await this.getCartById(cid);
        let cartProduct = await idCart[0];
        if (cartProduct) {
            const idProd = await cartProduct.products.find((product) => product.product._id == pid);
            if (idProd) {
                let arts = await cartProduct.products
                let newArts = await arts.Filter((cartProduct) => cartProduct.product._id != pid);

                if (newArts) {
                    await cartModel.updateOne({ _id: cid }, { products: newArts });
                    return "deletedarticle"
                }
            } else {
                return "artnotfound"
            }
        } else {
            return "cartnotfound"
        }

    }
    async deleteProdInCartProduct(cid) {
        const cartsId = await this.getCartById(cid);
        let cart = await cartsId[0];
        // let arts = await cartModel.updateOne({ _id: cid }, { product: [] });
        if (cart) {
            await cartModel.updateOne({ _id: cid }, { product: [] });
            return "deletedarticles";
        } else {
            return "cartnotfound";
        };
    }
    async addPCartWithId(cid, pid, quantity) {


        const idsFilter = await ProductManager.getProdById(pid);
        const cart = await this.getCartById(cid);
        const prdQuantity = quantity ? quantity : 1;
        let prodInCart = cart[0];
        if (prodInCart) {
            if (idsFilter) {
                const prodUpDate = await prodInCart.products;
                let artIndex = await prodUpDate.findIndex((prodInCart) => prodInCart.products._id == pid);
                // const prodUpDate = { $inc: { "products.$.quantity": pid.quantity } }
                // let siteProd = await prodUpDate.findIndex((art) => art.products._id == pid);
                if (artIndex != 1) {
                    prodUpDate[await artIndex].quantity = prodUpDate[artIndex].quantity + prdQuantity

                    // let siteProd = await artsToCart.findIndex((prodInCart) => prodInCart.products._id == id);
                    // prodUpDate[await siteProd].quantity = prodUpDate[siteProd].quantity + prdQuantity;

                } else {
                    prodUpDate.push({ products: pid, quantity: prdQuantity })
                    return "artAdded"
                }
                await cartModel.updateOne({ _id: cid }, { product: prodUpDate })
                return "artNotAdded";


            };
            if (siteProd != -1) {
                prodUpDate[await siteProd].quantity = prodUpDate[siteProd].quantity + prdQuantity;

            } else {
                prodUpDate.push({ products: pid, quantity: prdQuantity });

            } await cartModel.updateOne({ _id: cid }, { products: prodUpDate });
            return "added article";

        } else {
            return "cartNotFound"
        }
    }
    async upDateCart(cid, artsId) {
        const cartId = await this.getCartById(cid);
        let art = await cartId[0];
        if (art) {
            await cartModel.updateOne({ _id: cid }, artsId)
            return "updateCart";
        } else {
            return "notUpdateCart";
        }
    }
}
export default cartsManager;