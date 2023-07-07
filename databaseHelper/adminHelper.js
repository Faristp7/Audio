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
    await orderModel.updateOne(
      { _id: id },
      { $set: { orderStatus: orderstatus } }
    );

    if (orderstatus == "delivered") {
      const currentDate = new Date();
      await orderModel.updateOne(
        { _id: id },
        { $set: { deliveredDate: currentDate } }
      );
    }
    return true;
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
  removerCoupon: async (id) => {
    return await couponModel.deleteOne();
  },
  approveRequest: async (data, email) => {
    const { id, productId, quantity } = data;
    const status = await orderModel.updateOne(
      { _id: id },
      { $set: { returnRequest: true, orderStatus: "returned" } }
    );
    if (status) {
      return await productModel.updateOne(
        { _id: productId },
        { $inc: { quantity: quantity } }
      );
    }
  },
  updateWallet: async (amount, email) => {
    return await userModel.updateOne({ email }, { $set: { wallet: amount } });
  },
  overallData: async () => {
    const users = await userModel.countDocuments();
    const products = await productModel.countDocuments();
    const totalRevnue = await orderModel.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevnue: {
            $sum: { $subtract: ["$total", "$couponAmount"] },
          },
        },
      },
    ]);
    const revenue = totalRevnue.length > 0 ? totalRevnue[0].totalRevnue : 0;

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const totalRevnueThisMonth = await orderModel.aggregate([
      {
        $match: {
          orderStatus: "delivered",
          createdAt: { $gte: startOfMonth, $lt: endMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevnue: { $sum: { $subtract: ["$total", "$couponAmount"] } },
        },
      },
    ]);
    const revenueThisMonth =
      totalRevnueThisMonth.length > 0 ? totalRevnueThisMonth[0].totalRevnue : 0;

    const data = {
      users,
      products,
      revenue,
      revenueThisMonth,
    };
    return data;
  },
  monthlyRevenue: async () => {
    const monthlySales = await orderModel.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalSales: { $sum: { $subtract: ["$total", "$couponAmount"] } },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    return monthlySales;
  },
  categoriesRevenue: async () => {
    const revenueByCategories = await orderModel.aggregate([
      {
        $match: {
          orderStatus: "delivered",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$productDetails.category",
          totalRevenue: { $sum: { $multiply: ["$total", "$quantity"] } },
        },
      },
    ]);

    return revenueByCategories;
  },
};
