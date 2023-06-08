import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  status:{
    type:String,
    default:'Not Verified'
  },
  otp:{
    type:Number,
  },
  address:{
    type:Array,
  }
},{timestamps:true});
const userModel = mongoose.model("users", userSchema);
export default userModel;