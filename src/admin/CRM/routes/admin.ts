import { Request, Response } from "express"
import router from "../../../utils/global-router"
import { prisma } from "../../../utils/prisma"
import { login, register } from "../controller"
import { validate } from "../../../utils/validate"
import { loginSchema, registerSchema } from "../zodSchema.ts/validate"

//Super Admin 
router.post('/login',validate(loginSchema),login)
router.post('/register',validate(registerSchema),register)
module.exports=router