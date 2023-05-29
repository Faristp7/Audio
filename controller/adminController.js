import adminModel from "../models/adminModel.js";
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
export function table(req, res) {
  try {
    res.render("admin/table");
  } catch (error) {
    console.log(error);
  }
}
export function product(req, res) {
  try {
    res.render("admin/product");
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
        res.render("admin/adminLogin", {err});
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

export function postAddProduct(req ,res){
  try {
    
  } catch (error) {
    console.log(error);
  }
}