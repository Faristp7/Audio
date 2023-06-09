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
};
