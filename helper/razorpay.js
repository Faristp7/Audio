import Razorpay from "razorpay";
import dotenv from "dotenv"

dotenv.config({
  path: "../.env"
})

var instance = new Razorpay({
  key_id: process.env.razor_pay_key_id,
  key_secret: process.env.razor_pay_secrect_key,
});
export default instance;