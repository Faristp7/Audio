import sendOTP from "../helper/sendOtp.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import helper from "../databaseHelper/adminHelper.js";
import userHelper from "../databaseHelper/userHelper.js";
import productModel from "../models/productModel.js";

export function getHome(req, res) {
  try {
    res.render("user/index");
  } catch (error) {
    console.log(error);
  }
}

export function pageNotFound(req, res) {
  try {
    res.render("include/404error");
  } catch (error) {
    console.log(error);
  }
}

export async function getshop(req, res) {
  try {
    const category = req.query.category;
    const price = req.query.price;
    let product;
    if (req.query.category) {
      product = await helper.getProducts(category);
      res.render("user/shop", { product });
    } else if (req.query.price) {
      product = await helper.sortProduct(price);
      res.render("user/shop", { product });
    } else {
      product = await helper.findProduct();
      res.render("user/shop", { product });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function shopSingle(req, res) {
  try {
    const singleProduct = await userHelper.getProduct(req.params.id);
    const relatedProduct = await userHelper.relatedProduct(req.params.id);
    res.render("user/shopSingle", { singleProduct, relatedProduct });
  } catch (error) {
    console.log(error);
  }
}
export function login(req, res) {
  try {
    if (!req.session.user) {
      res.render("user/login");
    } else {
      res.redirect("/profile");
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
        if (user.status === "Blocked") {
          res.send("Blocked");
        } else if (user.status === "Not Verified") {
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

export async function searchProduct(req, res) {
  try {
    const data = await userHelper.searchProduct(req.body.searchKey);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
}

export async function profile(req, res) {
  try {
    const userProfile = await userHelper.findProfile(req.session.user);
    const user = userProfile[0];
    res.render("user/profile", { user });
  } catch (error) {
    console.log(error);
  }
}

export async function postProfile(req, res) {
  try {
    const mail = req.session.user;
    const { firstName, flatHouse, areaStreet, landmark, townCity, state } =
      req.body;
    if (
      firstName == "" ||
      flatHouse == "" ||
      areaStreet == "" ||
      landmark == "" ||
      townCity == "" ||
      state == ""
    ) {
      res.send("Fill all the field");
    } else {
      const updated = await userHelper.insertAddress(req.body, mail);
      if (updated) res.send("successfully added");
    }
  } catch (error) {
    console.log(error);
  }
}

export async function editAddress(req, res) {
  try {
    const userAddress = await userHelper.findUserAddress(
      req.params,
      req.session.user
    );
    res.render("user/editAddress", { userAddress });
  } catch (error) {
    console.log(error);
  }
}

export async function deleteAddress(req, res) {
  try {
    const status = await userHelper.removeAddress(req.body, req.session.user);
    if (status) res.send("delted");
  } catch (error) {
    console.log(error);
  }
}

export async function editAddressPost(req, res) {
  try {
    const { firstName, flatHouse, areaStreet, landmark, townCity, state } =
      req.body;
    if (
      firstName == "" ||
      flatHouse == "" ||
      areaStreet == "" ||
      landmark == "" ||
      townCity == "" ||
      state == ""
    ) {
      res.send("Fill all the field");
    } else {
      const unique = req.body.uniqueNumber;
      const status = await userHelper.updateAddress(
        req.session.user,
        req.body,
        unique
      );
      if (status) res.send("done");
    }
  } catch (error) {
    console.log(error);
  }
}

var Profileotp;

export async function updateUser(req, res) {
  try {
    const bodyOtp = req.body.otp;
    if (bodyOtp) {
      if (Profileotp == req.body.otp) {
        req.session.user = req.body.email;
        const status = await userHelper.updateUserForm(req.body);
        res.send(status ? true : false);
      } else {
        res.send("otp incorrect");
      }
    } else {
      if (req.session.user == req.body.email) {
        req.session.user = req.body.email;
        const status = await userHelper.updateUserForm(req.body);
        res.send(status ? true : false);
      } else {
        res.send("enter otp");
      }
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateEmailOtpSend(req, res) {
  try {
    Profileotp = Math.floor(1000 + Math.random() * 9000);

    const bodyMail = req.body.email;
    await sendOTP(bodyMail, Profileotp);
    console.log(`Profileotp = ${Profileotp}`);
  } catch (error) {
    console.log(error);
  }
}

export async function orderButton(req, res) {
  try {
    const orders = await userHelper.getOrders(req.session.user)

    // const productIds = orders.map((order) =>
    //   order.product
    // );

    // const products = await userHelper.getProductArray(productIds);
    

    res.render("user/orders", { orders });
  } catch (error) {
    console.log(error);
  }
}
