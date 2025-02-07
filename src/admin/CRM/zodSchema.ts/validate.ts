import { z } from "zod";

export const loginSchema = z.object({
//   name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema=z.object({
  name:z.string().min(1,{message:"Name is required"}).max(10,{message:"Name should not exceed more than 10 characters"}),
  email:z.string({message:"Email should be string"}).email({message:"Please check your email"}),
  phone:z.string().optional(),
  password:z.string().min(1,{message:"Password is required"}),
  confirmPassword:z.string().min(1,{message:"Confirm Password is required"})
})
.refine((data)=>data.password===data.confirmPassword,{
  message:"Passwords doesn't match",
  path:["confirmPassword"]
})