const express=require('express')
const app=express()
export const router=express.Router()
const cors = require("cors");
require("dotenv").config();
const PORT=process.env.PORT || 5000
import bodyParser from "body-parser";
import { NextFunction, Request, Response } from "express";
const fileUpload = require("express-fileupload");
//CORS
app.use(cors({ origin: "*", }));


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// Error handling middleware for handling the 413 error.
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error && (err as any).status === 413 && 'body' in err) {
      return res.status(413).json({ error: 'Request Entity Too Large' });
    } else {
      next();
    }
  });
  
  app.use(express.json());
  app.use(fileUpload());
  
  app.get("/", (req: Request, res: Response) => {
    return res.status(200).send(`Welcome to ${process.env.APP_NAME}(${Math.floor(process.uptime())}s)🎉`);
  })
  
  app.use('/admin/crm',require("./admin/CRM/routes/admin"))
  app.use('/admin/oms',require("./admin/OMS/routes/admin"))
  app.use('/admin/pims',require("./admin/PIMS/routes/admin"))
  // app.use('/api/crm',require(""))
  // app.use('/api/oms',require(""))
  // app.use('/api/pims',require(""))
app.listen(PORT,()=>{
    console.log("app running on port:",PORT)
})

