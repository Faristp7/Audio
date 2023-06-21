import express, { Router } from "express";
import {
  addProduct,
  adminLogin,
  dashboard,
  doUserUnBlock,
  doUserblock,
  editProduct,
  getOrders,
  listProduct,
  logout,
  pageNotFound,
  postAddProduct,
  postEditProduct,
  postadminLogin,
  product,
  unListProduct,
  user,
} from "../controller/adminController.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = Router();
router.get("/logout", adminAuth, logout);
router.get("/", adminLogin);
router.get("/dashboard", adminAuth, dashboard);
router.get("/user", user);
router.get("/pageNotFound", pageNotFound);
router.get("/product", product);
router.get("/addProduct", adminAuth, addProduct);
router.get("/editProduct/:id", editProduct);
router.get("/orders", getOrders);

router.post("/login", postadminLogin);
router.post("/addProduct", postAddProduct);
router.post("/doUserblock", doUserblock);
router.post("/doUserUnBlock", doUserUnBlock);
router.post("/unlistProduct", unListProduct);
router.post("/listProduct", listProduct);
router.post("/postEditProduct", postEditProduct);
export default router;
