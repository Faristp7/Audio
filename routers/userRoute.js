import express ,{Router} from "express"
import { getHome, getshop, shopSingle } from "../controller/userController.js"
const router = Router()
router.get('/',getHome )
router.get('/shop',getshop)
router.get('/shopSingle',shopSingle)

export default router