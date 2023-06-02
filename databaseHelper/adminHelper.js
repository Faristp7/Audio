import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
export default {
  getUsers: async () => {
    return await userModel.find();
  },
  doUserBlock: async (id) => {
    return await userModel.updateOne({ _id: id }, { status: "Blocked" });
  },
  doUserUnBlock: async (id) => {
    return await userModel.updateOne({ _id: id }, { status: "Verified" });
  },
  addproduct: async (
    { productName, Description, productPrice, quantity, category },
    urls
  ) => {
    const productSchema = new productModel({
      productName,
      Description,
      productPrice,
      quantity,
      category,
      coverImage: urls[0],
      imageOne: urls[1],
      imageTwo: urls[2],
    });
    return await productSchema.save();
  },
  getProducts: async () => {
    return await productModel.find();
  },
  doUnlist: async (id) => {
    return await productModel.updateOne({ _id: id.id }, {productList: false});
  },
  doList: async (id) => {
    return await productModel.updateOne({ _id: id.id }, {productList: true});
  }
};
