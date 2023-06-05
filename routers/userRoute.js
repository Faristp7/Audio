import express, { Router } from "express";
import {
  getHome,
  getshop,
  login,
  logout,
  pageNotFound,
  postUserLogin,
  profile,
  resendOtp,
  searchProduct,
  shopSingle,
  signup,
  userSignup,
  verifyOtp,
} from "../controller/userController.js";
import { userAuth } from "../middleware/userAuth.js";

const router = Router();
router.get("/", getHome);
router.get("/shop", getshop);
router.get("/shopSingle/:id", shopSingle);
router.get("/login", login);
router.get("/logout", userAuth, logout);
router.get("/signup", signup);
router.get("/profile", profile);
router.get("/pageNotFound", pageNotFound);

router.post("/signup", userSignup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", postUserLogin);
router.post("/resendOtp", resendOtp);
router.post("/searchProduct", searchProduct);

export default router;
