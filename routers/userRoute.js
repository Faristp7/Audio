import express ,{Router} from "express"
import { getHome, getshop, login, shopSingle, signup } from "../controller/userController.js"
const router = Router()
router.get('/',getHome )
router.get('/shop',getshop)
router.get('/shopSingle',shopSingle)
router.get('/login',login)
router.get('/signup',signup)

export default router