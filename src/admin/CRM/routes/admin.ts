import { Request, Response } from "express"
import router from "../../../utils/global-router"
import { prisma } from "../../../utils/prisma"
import { login, register } from "../controller"

//Super Admin 
router.post('/login',login)
router.post('/register',register)
module.exports=router