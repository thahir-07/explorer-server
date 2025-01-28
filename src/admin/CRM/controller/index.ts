import { Request, Response } from "express";
import { prisma } from "../../../utils/prisma";
import { encryptPassword } from "../../../utils/encrypt";
const jwt=require('jsonwebtoken')
export const login=async (req:Request,res:Response)=>{
    try{
        const {email,password,phone}=req.body
    const exist=await prisma.superAdmin.findFirst({
        where:{
            OR:[
                email,
                phone,
            ],
            password:encryptPassword(password)
        },
        select:{
            id:true,
            email:true,
            name:true,
            phone:true
        }
    });
    if(exist){
        const token=jwt.sign({
            id:exist?.id,
            name:exist?.name,
            email:exist?.email,
            phone:exist?.phone
        },
        process.env.JWT_SECRET
    )
        return res.status(201).json({message:"Login successful.",data:{...exist,token}})
    }
    else{
        return res.status(400).json({message:"Email or Password incorrect."})
    }
    }
    catch(e:any){
        res.status(500).json({message:"Something went wrong.",error:e})
    }
    
}

export const register=async(req:Request,res:Response)=>{
    try{
        const {name,email,phone,password,confirmPassword}=req.body
        if(password!==confirmPassword){
            res.status(400).json({message:"Password and confirm Password doesn't match."});
        }
        const exist=await prisma.superAdmin.findFirst({
            where:{
                OR:[
                    email,
                    name,
                    phone
                ]
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone:true,
            }
        })
        if(exist){
            const conflictedField=exist?.email===email?"Email":(exist?.phone===phone?"phone":"name")
            res.status(400).json({message:`${conflictedField} already exist.`})
        }
        
        const superAdmin=prisma.superAdmin.create({
            data:{
                name,
                email,
                phone,
                password:await encryptPassword(password),
            },
            select:{
                id:true,
                name:true,
                email:true,
                phone:true
            }
        })
        const token:any=jwt.sign({
            id:exist?.id,
            name:exist?.name,
            email:exist?.email,
            phone:exist?.phone,
        },
        process.env.JWT_SECRET
        
    )
    res.status(201).json({message:"Successfully registered.",data:{...superAdmin,token}})
    }
    catch(e:any){
        res.status(500).json({message:"Something went wrong",error:e})
    }
}