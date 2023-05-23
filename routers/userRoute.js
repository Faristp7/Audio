import express ,{Router} from "express"
import { getHome } from "../controller/userController.js"
const router = Router()
router.get('/',getHome )

export default router