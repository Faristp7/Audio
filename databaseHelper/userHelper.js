import productModel from "../models/productModel.js"

export default {
    getProduct : async (id) => {
        return await productModel.findById(id)
    }
}
