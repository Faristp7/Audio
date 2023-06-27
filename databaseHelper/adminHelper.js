import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import couponModel from "../models/couponModel.js";

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
  getProducts: async (category) => {
    if (category) return await productModel.find({ category });
    else return await productModel.find();
  },
  sortProduct: async (price) => {
    if (price == "low")
      return await productModel.find().sort({ productPrice: 1 });
    else if (price == "high")
      return await productModel.find().sort({ productPrice: -1 });
    else return await productModel.find();
  },
  findProduct: async () => {
    return await productModel.find();
  },
  doUnlist: async (id) => {
    return await productModel.updateOne({ _id: id.id }, { productList: false });
  },
  doList: async (id) => {
    return await productModel.updateOne({ _id: id.id }, { productList: true });
  },
  updateProduct: async (
    { productName, Description, productPrice, quantity, category },
    id
  ) => {
    return await productModel.updateOne(
      { _id: id },
      {
        productName: productName,
        Description: Description,
        productPrice: productPrice,
        quantity: quantity,
        category: category,
      }
    );
  },
  getOrdersAdmin: async () => {
    return await orderModel.find().sort({ createdAt: -1 }).populate("product");
  },
  orderControl: async (id, orderstatus) => {
    return await orderModel.updateOne(
      { _id: id },
      { $set: { orderStatus: orderstatus } }
    );
  },
  addCoupon: async (objects) => {
    const { couponName, couponCode, validity, amount, minimumPurchase } =
      objects;

    const existingCoupon = await couponModel.findOne({
      $or: [{ couponCode: couponCode }, { couponName: couponName }],
    });

    if (existingCoupon) {
      return false;
    } else {
      const orderSchema = new couponModel({
        couponName,
        couponCode,
        validity,
        amount,
        minimumPurchase,
      });
      await orderSchema.save();
      return true;
    }
  },
  getCoupon: async () => {
    return await couponModel.find();
  },
  removerCoupon : async (id) => {
    return await couponModel.deleteOne()
  }
};
