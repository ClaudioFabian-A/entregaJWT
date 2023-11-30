import mongoose from "mongoose";
import MongoosePaginate from "mongoose-paginate-v2";


// const collection = "Products";

const Prodschema = new mongoose.Schema({
    title: String,
    description:String,
    category: String,
    code: String,
    stock: Number,
    price: Number,
    thumbnail: Array,
    status: Boolean,

});
Prodschema.plugin(MongoosePaginate);

export const productsModel = mongoose.model("products", Prodschema);
