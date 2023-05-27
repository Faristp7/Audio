import express ,{Router} from "express"
import { addProduct, adminLogin, dashboard, postadminLogin, product, table } from "../controller/adminController.js"

const router = Router()
router.get("/",adminLogin)
router.get("/dashboard",dashboard)
router.get("/table",table)
router.get("/product",product)
router.get("/addProduct",addProduct)

router.post("/login",postadminLogin)
export default router
