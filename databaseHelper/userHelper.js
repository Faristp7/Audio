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
    return await userModel.updateOne(
      { email: email },
      { $addToSet: { cart: data } }
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
};
