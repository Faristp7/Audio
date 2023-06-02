import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    imageOne: {
      type: String,
      required: true,
    },
    imageTwo: {
      type: String,
      required: true,
    },
    productList: {
      type : Boolean,
      default : true
    },
  },
  { timestamps: true }
);
const productModel = mongoose.model("product", productSchema);
export default productModel;