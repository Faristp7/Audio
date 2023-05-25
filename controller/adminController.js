import adminModel from "../models/adminModel.js";
let err 
export function adminLogin(req, res) {
  try {
    res.render("admin/adminLogin",{err});
    err = false
  } catch (error) {
    console.log(error);
  }
}
export function dashboard(req, res) {
  try {
    res.render("admin/dashboard");
  } catch (error) {
    console.log(error);
  }
}

export async function postadminLogin(req, res) {
  try {
    const admin = await adminModel.findOne({ email: req.body.email });
   
    if (admin) {
      if (admin.password == req.body.password) {
        res.redirect("/admin/dashboard");
      }
      else{
          res.redirect("/admin")
          err = true
      }
    } 
    else{
        res.redirect("/admin")
        err = true
    }
    
  } catch (error) {
    console.log(error);
  }
}
