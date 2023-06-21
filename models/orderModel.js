import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    orderStatus: {
      type: String,
      default : "pending"
    },
    paid: { 
      type: String,
      default: "pending",
    },
    userId: {
      type: String,
      required: true,
    },
    total : {
        type : Number,
        default : 0
    },
    products: [
      {
        productId:{
          type:mongoose.Schema.Types.ObjectId,
        },
        quantity:{
          type:Number,
        }
      }
    ],
    paymentType : {
      type : String,
      required : true
    }
  },
  { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;