import Razorpay from "razorpay";

var instance = new Razorpay({
  key_id: process.env.razor_pay_key_id,
  key_secret: process.env.razor_pay_secrect_key,
});
export default instance;