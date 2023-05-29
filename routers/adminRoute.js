import express ,{Router} from "express"
import { addProduct, adminLogin, dashboard, logout, postAddProduct, postadminLogin, product, table } from "../controller/adminController.js"
import { adminAuth } from "../middleware/adminAuth.js"

const router = Router()
router.get("/logout",adminAuth,logout);
router.get("/",adminLogin)
router.get("/dashboard",adminAuth,dashboard)
router.get("/table",table) //user
router.get("/product",product)
router.get("/addProduct",adminAuth,addProduct)

router.post("/login",postadminLogin) 
router.post("/addProduct",postAddProduct)
export default router
