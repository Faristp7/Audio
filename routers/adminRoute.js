import express ,{Router} from "express"
import { adminLogin } from "../controller/adminController.js"

const router = Router()
router.get("/",adminLogin)

export default router
