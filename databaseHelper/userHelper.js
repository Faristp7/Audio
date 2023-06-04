import productModel from "../models/productModel.js"

export default {
    getProduct : async (id) => {
        return await productModel.findById(id)
    },
    relatedProduct : async (id) => { 
        const categoryFind = await productModel.findOne({_id:id})
        if(!categoryFind){
            throw new Error("Product not been Found")
        }
        const category = categoryFind.category
        if(category === "TWS"){
            return await productModel.find({category : "TWS", _id:{$ne: (id)}}).limit(3)
        }
        else if(category === "Headphone"){
            return await productModel.find({category : "Headphone", _id:{$ne: (id)}}).limit(3)
        }
    },
}
