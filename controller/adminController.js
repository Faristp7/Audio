import adminModel from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import helper from "../databaseHelper/adminHelper.js";
import { cloudinaryUploadImage } from "../helper/cloudinary.js";
import userHelper from "../databaseHelper/userHelper.js";
import Razorpay from "razorpay";

let err;
export function adminLogin(req, res) {
  try {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/adminLogin", { err });
    }
    err = false;
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
export function dashboard(req, res) {
  try {
    if (req.session.admin) {
      res.render("admin/dashboard");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
  }
}
export async function user(req, res) {
  try {
    const users = await helper.getUsers();
    res.render("admin/user", { users });
  } catch (error) {
    console.log(error);
  }
}
export async function product(req, res) {
  try {
    const product = await helper.getProducts();
    res.render("admin/product", { product });
  } catch (error) {
    console.log(error);
  }
}
export function addProduct(req, res) {
  try {
    res.render("admin/addProduct");
  } catch (error) {
    console.log(error);
  }
}
export function logout(req, res) {
  try {
    req.session.admin = null;
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
}

export async function doUserblock(req, res) {
  try {
    let status = await helper.doUserBlock(req.body.id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function doUserUnBlock(req, res) {
  try {
    let status = await helper.doUserUnBlock(req.body.id);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

// verify the admin login

export async function postadminLogin(req, res) {
  let err;
  try {
    const admin = await adminModel.findOne({ email: req.body.email });
    if (admin) {
      if (admin.password == req.body.password) {
        req.session.admin = {
          email: req.body.email,
        };
        console.log(req.session.admin);
        res.redirect("/admin/dashboard");
      } else {
        err = true;
        res.render("admin/adminLogin", { err });
      }
    } else {
      res.redirect("/admin");
      err = true;
    }
  } catch (error) {
    console.log(error);
  }
}

//add product

export async function postAddProduct(req, res) {
  try {
    cloudinaryUploadImage(req.body.images)
      .then(async (urls) => {
        const status = await helper.addproduct(req.body, urls);
        if (status) res.send(true);
        else res.send(false);
        console.log("image url", urls);
      })
      .catch((err) => res.status(500).send(err));
  } catch (error) {
    console.log(error);
  }
}

export function unListProduct(req, res) {
  const id = req.body;
  console.log(id);
  const productList = helper.doUnlist(id);
  productList ? res.send(true) : res.send(false);
}
export function listProduct(req, res) {
  const id = req.body;
  console.log(id);
  const productList = helper.doList(id);
  productList ? res.send(true) : res.send(false);
}

export async function editProduct(req, res) {
  try {
    const productInfo = await userHelper.getProduct(req.params.id);
    res.render("admin/editProduct", { productInfo });
  } catch (error) {
    console.log(error);
  }
}

export async function postEditProduct(req, res) {
  // cloudinaryUploadImage(req.body.images)
  // const status = await helper.addproduct(req.body,urls);
  //     if (status) res.send(true);
  //     else res.send(false);
  //     console.log(urls);
  const id = req.body.id;
  const updated = await helper.updateProduct(req.body, id);
  return updated ? res.send(true) : res.send(false);
}

export async function getOrders(req, res) {
  try {
    const orders = await helper.getOrdersAdmin();
    res.render("admin/orders", { orders });
  } catch (error) {
    console.log(error);
  }
}

export async function orderControl(req, res) {
  try {
    const { id, orderStatus } = req.body;
    const status = await helper.orderControl(id, orderStatus);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function couponController(req, res) {
  try {
    const coupons = await helper.getCoupon();
    res.render("admin/coupon", { coupons });
  } catch (error) {
    console.log(error);
  }
}

export async function addCoupon(req, res) {
  try {
    res.render("admin/addCoupon");
  } catch (error) {
    console.log(error);
  }
}

export async function addCouponPost(req, res) {
  try {
    const status = await helper.addCoupon(req.body);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function removeCoupon(req, res) {
  try {
    const status = await helper.removerCoupon(req.body);
    status ? res.send(true) : res.send(false);
  } catch (error) {
    console.log(error);
  }
}

export async function approveRequest(req, res) {
  try {
    let finalAmount;
    const status = await helper.approveRequest(req.body, req.session.user);
    const productPriceCalculate = await userHelper.findOrderId(req.body);
    if (status) {
      finalAmount =
        productPriceCalculate[0].total - productPriceCalculate[0].couponAmount;
    }
    if (productPriceCalculate[0].paymentType == "COD") {
      const success = await helper.updateWallet(finalAmount, req.session.user);
      success ? res.send("refundDone") : undefined;
    } else {
      const client = new Razorpay({
        key_id: process.env.razor_pay_key_id,
        key_secret: process.env.razor_pay_secrect_key,
      });

      const paymentId = productPriceCalculate[0].paymentId;
      const receiptNumber = Math.random().toString(36).substring(7);
      const amount = finalAmount * 100;
      const refund = await client.payments.refund(paymentId, {
        amount: amount,
        speed: "optimum",
        notes: {
          reason: "customer requested a refund",
        },
        receipt: receiptNumber,
      });

      refund ? res.send("refundDone") : undefined;
    }
  } catch (error) {
    console.log(error);
  }
}
