import express, { Router } from "express";
import {
  addProduct,
  adminLogin,
  dashboard,
  doUserUnBlock,
  doUserblock,
  imageUpload,
  logout,
  postAddProduct,
  postadminLogin,
  product,
  user,
} from "../controller/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();
router.get("/logout", adminAuth, logout);
router.get("/", adminLogin);
router.get("/dashboard", adminAuth, dashboard);
router.get("/user", user);
router.get("/product", product);
router.get("/addProduct", adminAuth, addProduct);

router.post("/login", postadminLogin);
router.post("/addProduct", postAddProduct);
router.post("/doUserblock", doUserblock);
router.post("/doUserUnBlock", doUserUnBlock);
router.post("/imageUpload", imageUpload);
export default router;
