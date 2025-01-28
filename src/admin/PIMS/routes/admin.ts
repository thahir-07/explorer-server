import router from "../../../utils/global-router"
import { Request, Response } from "express"
router.get("/test",(req:Request,res:Response)=>{
    console.log("test working")
})
module.exports=router