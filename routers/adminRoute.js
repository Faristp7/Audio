import express ,{Router} from "express"
import { adminLogin, dashboard, postadminLogin } from "../controller/adminController.js"

const router = Router()
router.get("/",adminLogin)
router.get("/dashboard",dashboard)

router.post("/login",postadminLogin)
export default router
