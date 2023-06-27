import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    couponName: {
      type: String,
    },
    couponCode: {
      type: String,
      required: true,
    },
    validity: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
    },
    minimumPurchase: {
      type: Number,
    },
  },
  { timestamps: true }
);
const couponModel = mongoose.model("coupon", couponSchema);
export default couponModel;
