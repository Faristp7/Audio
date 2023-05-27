import express ,{Router} from "express"
import { addProduct, adminLogin, dashboard, logout, postadminLogin, product, table } from "../controller/adminController.js"
import { adminAuth } from "../middleware/adminAuth.js"

const router = Router()
router.post("/login",postadminLogin)
router.get("/logout",logout);
router.get("/",adminLogin)
router.use(adminAuth)
router.get("/dashboard",dashboard)
router.get("/table",table) //user
router.get("/product",product)
router.get("/addProduct",addProduct)

export default router
