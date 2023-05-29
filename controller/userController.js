import sendOTP from "../helper/sendOtp.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export function getHome(req, res) {
  try {
    res.render("user/index");
  } catch (error) {
    console.log(error);
  }
}
export function getshop(req, res) {
  try {
    res.render("user/shop");
  } catch (error) {
    console.log(error);
  }
}
export function shopSingle(req, res) {
  try {
    res.render("user/shopSingle");
  } catch (error) {
    console.log(error);
  }
}
export function login(req, res) {
  try {
    res.render("user/login");
  } catch (error) {
    console.log(error);
  }
}
export function signup(req, res) {
  try {
    res.render("user/signup", {
      error: false,
      message: "",
    });
  } catch (error) {
    console.log(error);
  }
}

// verify the admin
export async function userSignup(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (email == "" || name == "" || password == "" || phone == "") {
      res.render("user/signup", {
        error: true,
        message: "all fields must be filled",
      });
    }
    else if(phone.length < 10){
      console.log(1);
      res.render("user/signup", {
        error: true,
        message: "Number must be 10 digits",
      });
    }
    else{
      const user = await userModel.findOne({ email });
    if (user) {
      res.send({error : true , message : "fill all the field"})
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const userSchema = new userModel({
        name,
        email,
        password: hashedPassword,
        phone,
      });
      await userSchema.save();
      const otp = Math.floor(1000 + Math.random() * 9000);
      await userModel.updateOne({ email }, { otp });
      console.log(otp);
      await sendOTP(req.body.email, otp);
      res.send(true);
    }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function verifyOtp(req, res) {
  try {
    const userData = await userModel.findOne({email:req.body.email})
    if(req.body.otp == userData.otp){
      await userModel.updateOne({email:req.body.email},{status:'Verified'})
      await userModel.updateOne({email:req.body.email},{$unset : {otp : req.body.otp}})
      res.send('Success')
    }
    else{
      res.send('Error')
    }
  } catch (error) {
    console.log(error);
  }
}
