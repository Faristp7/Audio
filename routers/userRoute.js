import express ,{Router} from "express"
import { getHome, getshop, login, shopSingle, signup, userSignup,verifyOtp } from "../controller/userController.js"
const router = Router()
router.get('/',getHome )
router.get('/shop',getshop)
router.get('/shopSingle',shopSingle)
router.get('/login',login)
router.get('/signup',signup)

router.post("/signup",userSignup) 
router.post("/verifyOtp",verifyOtp) 

export default router