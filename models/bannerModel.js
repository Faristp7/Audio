import mongoose, { Mongoose } from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    bannerHeading: {
      type: String,
      required: true,
    },
    Description: {
      type: String,
      required: true,
    },
    couponCode: {
      type: String,
    },
    Image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const bannerModel = mongoose.model("banner", bannerSchema);
export default bannerModel;
