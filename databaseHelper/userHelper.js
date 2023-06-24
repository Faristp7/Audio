import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

export default {
  getProduct: async (id) => {
    return await productModel.findById(id);
  },
  relatedProduct: async (id) => {
    const categoryFind = await productModel.findOne({ _id: id });
    if (!categoryFind) {
      throw new Error("Product not been Found");
    }
    const category = categoryFind.category;
    if (category === "TWS") {
      return await productModel
        .find({ category: "TWS", _id: { $ne: id } })
        .limit(3);
    } else if (category === "Headphone") {
      return await productModel
        .find({ category: "Headphone", _id: { $ne: id } })
        .limit(3);
    }
  },
  searchProduct: async (search) => {
    return await productModel
      .find({
        productName: { $regex: new RegExp("^" + search + ".*", "i") },
      })
      .exec();
  },
  filterTWS: async () => {
    return await productModel.find({ category: "TWS" });
  },
  findProfile: async (userSession) => {
    return await userModel.find({ email: userSession });
  },
  insertAddress: async (Address, Email) => {
    const uniqueNumber = Date.now().toString();
    return await userModel.findOneAndUpdate(
      { email: Email },
      { $addToSet: { address: { ...Address, uniqueNumber } } }
    );
  },
  findUserAddress: async (uniqueNumber, email) => {
    return await userModel.findOne(
      { email },
      { address: { $elemMatch: uniqueNumber } }
    );
  },
  removeAddress: async (unique, email) => {
    const value = unique.uniqe;
    return await userModel.findOneAndUpdate(
      { email },
      { $pull: { address: { uniqueNumber: `${value}` } } },
      { new: true }
    );
  },
  updateAddress: async (email, data, uniqe) => {
    return await userModel.updateOne(
      { email, address: { $elemMatch: { uniqueNumber: uniqe } } },
      { $set: { "address.$": data } }
    );
  },
  updateUserForm: async (data) => {
    const id = data.id;
    return await userModel.updateOne(
      { _id: id },
      { $set: { name: data.name, phone: data.phone, email: data.email } }
    );
  },
  addToCart: async (data, email) => {
    let quantity = { ...data, quantity: 1 };
    return await userModel.updateOne(
      { email: email },
      { $addToSet: { cart: quantity } }
    );
  },
  findUser: async (email) => {
    return await userModel.find({ email }, { cart: 1 });
  },
  findProductById: async (id) => {
    return await productModel.find({ _id: id });
  },
  removeProduct: async (email, obj) => {
    return await userModel.updateOne(
      { email },
      { $pull: { cart: { productId: obj.id } } }
    );
  },
  findAddress: async (email) => {
    return await userModel.find({ email }, { address: 1 });
  },
  quantityController: async (email, obj) => {
    const quantityModifier = obj.deside ? 1 : -1;
    return await userModel.updateOne(
      { email, "cart.productId": obj.id },
      { $inc: { "cart.$.quantity": quantityModifier } }
    );
  },
  quantityFinder: async (email) => {
    return await userModel.find({ email });
  },
  checkoutSave: async (address, paymentType, userId, total, products) => {
    const afs = address;
    let paid = "pending";
    if (paymentType === "Online") {
      paid = "paid";
    }
    products;
    for (let i = 0; i < products.length; i++) {
      const orderSchema = new orderModel({
        address: afs,
        userId,
        total: total[i],
        product: products[i].productId,
        quantity: products[i].quantity,
        paymentType,
        paid,
      });
      await orderSchema.save();
    }
    return true;
  },
  destroyCart: async (email) => {
    return await userModel.updateOne({ email }, { $unset: { cart: "" } });
  },
  quantityMinus: async (values) => {
    try {
      for (const item of values) {
        const { productId, quantity } = item;
        await productModel.updateOne(
          { _id: productId },
          { $inc: { quantity: -quantity } }
        );
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
  getOrders: async (email ,page) => { 
    const limit = 5
    const skip = (page - 1) * limit

    const totalOrders = await orderModel.countDocuments({userId : email})
    const totalPages = Math.ceil(totalOrders / limit)
    const orders  = await orderModel
    .find({ userId: email })
    .populate("product")
    .sort({createdAt : -1})
    .skip(skip)
    .limit(limit)
    return {orders, totalPages}
  },

  getProductArray: async (ids) => {
    const product = await productModel.find({ _id: { $in: ids } });             
    return product;
  },
  getUserAddres: async (email, addresses) => {
    return await userModel.findOne(
      { email },
      { address: { $elemMatch: { uniqueNumber: addresses } } }
    );
  },
  cancelOrder : async (objectId) => {
    const {id} = objectId
    const updated = await orderModel.updateOne({_id : id},{$set : {orderStatus : 'cancelled'}})
    if(updated == true){
      // return await productModel.updateOne
    }
  }
};
