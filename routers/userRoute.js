import express, { Router } from "express";
import {
  deleteAddress,
  editAddress,
  editAddressPost,
  getHome,
  getshop,
  login,
  logout,
  orderButton,
  pageNotFound,
  postProfile,
  postUserLogin,
  profile,
  resendOtp,
  searchProduct,
  shopSingle,
  signup,
  updateEmailOtpSend,
  updateUser,
  userSignup,
  verifyOtp,
} from "../controller/userController.js";
import { userAuth } from "../middleware/userAuth.js";
import {
  addToCart,
  addToCartPost,
  checkout,
  checkoutPost,
  quantityController,
  removeProduct,
} from "../controller/productController.js";

const router = Router();
router.get("/", getHome);
router.get("/shop/", getshop);
router.get("/shopSingle/:id", shopSingle);
router.get("/login", login);
router.get("/logout", userAuth, logout);
router.get("/signup", signup);
router.get("/profile", profile);
router.get("/pageNotFound", pageNotFound);
router.get("/editAddress/:uniqueNumber", editAddress);
router.get("/addToCart", userAuth, addToCart);
router.get("/checkout", checkout);
router.get("/orders", orderButton);

router.post("/signup", userSignup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", postUserLogin);
router.post("/resendOtp", resendOtp);
router.post("/searchProduct", searchProduct);
router.post("/postProfile", postProfile);
router.post("/editAddressPost", deleteAddress);
router.post("/editAddressForm", editAddressPost);
router.post("/updateUser", updateUser);
router.post("/profileOtpSend", updateEmailOtpSend);
router.post("/addToCartPost", userAuth, addToCartPost);
router.post("/removeProduct", removeProduct);
router.post("/quantity", quantityController);
router.post("/checkoutPost", checkoutPost);

export default router;
