import mongoose from "mongoose";
import { productsModel } from "./productsModel.js";
const carts= "carts";


const cardSchema = new mongoose.Schema(
  {
    products: {
      type: {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      }
    }
  },{_id:false});
 
//   const cardschema= new mongoose.Schema({
//     products:{
//       type:[cardSubSchema],
//       default:[],
//     }
//   }
//   ,{timestamps:true})


cardSchema.pre(["save","findOne","find"], function () {
  this.populate("products.product")

});


 export const cartModel = mongoose.model("carts", cardSchema);

