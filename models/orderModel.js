import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: true,
    },
    qunatity: {
      type: Number,
      required: true,
    },
    total : {
        type : Number,
        default : 0
    },
    products : {
      type : Array,
      required : true
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;