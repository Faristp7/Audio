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
    if (!req.session.user) {
      res.render("user/login");
    } else {
      res.render("user/profile");
    }
  } catch (error) {
    console.log(error);
  }
}
export function logout(req, res) {
  try {
    req.session.user = null;
    res.redirect("/");
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

// verify the user
export async function userSignup(req, res) {
  try {
    const { name, email, phone, password } = req.body;
    if (email == "" || name == "" || password == "" || phone == "") {
      res.send({ error: true, message: "fill all the field" });
    } else if (phone.length < 10 || phone.length > 10) {
      console.log(1);
      res.send({ error: true, message: "Number must be 10 digits" });
    } else {
      const user = await userModel.findOne({ email });
      if (user) {
        res.send({ error: true, message: "Email already exists" });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
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
    const otp = parseInt(req.body?.otp);
    const userData = await userModel.findOne({
      email: req.body.email ? req.body.email : req.session?.user.email,
    });
    console.log(req.body.otp);
    if (otp == userData?.otp) {
      await userModel.updateOne(
        { email: req.body.email },
        { $set: { status: "Verified" } }
      );
      await userModel.updateOne(
        { email: req.body.email },
        { $unset: { otp: req.body.otp } }
      );
      res.send("Success");
    } else {
      res.send("Error");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function resendOtp(req, res) {
  try {
    const email = req.body.email;
    const otp = Math.floor(1000 + Math.random() * 9000);
    await userModel.updateOne({ email }, { otp });
    console.log(`resended otp ${otp}`);
    await sendOTP(req.body.email, otp);
  } catch (error) {
    console.log(error);
  }
}

export async function postUserLogin(req, res) {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (isPasswordValid) {
        if(user.status === "Blocked"){
          res.send("Blocked")
        }
        else if (user.status === "Not Verified") {
          res.send({ error: true, message: "Not Verified" });
        } else {
          req.session.user = req.body.email;
          res.send("success");
        }
      } else {
        res.send("password invalid");
      }
    } else {
      res.send("No user");
    }
  } catch (error) {
    console.log(error);
  }
}

export function profile(req, res) {
  try {
    res.render("user/profile");
  } catch (error) {
    console.log(error);
  }
}
