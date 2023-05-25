import mongoose from "mongoose";


const adminModel = new mongoose.Schema(
  {
email:String,
password:String
  },
  { timestamps: true },
);


export default mongoose.model('admin', adminModel);