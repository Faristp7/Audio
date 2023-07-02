import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    address: {
      type : Object,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paid: {
      type: String,
      default: "pending",
    },
    userId: {
      type: String,
      required: true,
    },
    total: {
      type: Number,
      default: 0,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
    },
    paymentType: {
      type: String,
      required: true,
    },
    paymentId : {
      type : String,
    },
    couponAmount : {
      type : Number,
      default : 0
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
