import adminModel from "../models/adminModel.js";
import productModel from "../models/productModel.js";
import helper from "../databaseHelper/adminHelper.js";
import { cloudinaryUploadImage } from "../helper/cloudinary.js";
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
      const status = await helper.addproduct(req.body,urls);
      if (status) res.send(true);
      else res.send(false);
      console.log(urls);
    })
    .catch((err) => res.status(500).send(err))
  } catch (error) {
    console.log(error);
  }
}

export function unListProduct(req,res){
  const id = req.body
  console.log(id);
   const productList = helper.doUnlist(id)
   productList ? res.send(true) : res.send(false);
}
export function listProduct(req,res){
  const id = req.body
  console.log(id);
   const productList = helper.doList(id)
   productList ? res.send(true) : res.send(false);
}