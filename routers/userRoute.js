import express ,{Router} from "express"
import { getHome, getshop, login, postUserLogin, profile, shopSingle, signup, userSignup,verifyOtp } from "../controller/userController.js"
const router = Router()
router.get('/',getHome )
router.get('/shop',getshop)
router.get('/shopSingle',shopSingle)
router.get('/login',login)
router.get('/signup',signup)
router.get('/profile',profile)

router.post("/signup",userSignup) 
router.post("/verifyOtp",verifyOtp) 
router.post("/login",postUserLogin)

export default router