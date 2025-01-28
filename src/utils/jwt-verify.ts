import { NextFunction, Request, Response } from "express";
import jwt=require("jsonwebtoken")

const handleAuthSkipUrls = ["/order/update-status"];

export const validateToken = () => async (req: Request, res: Response, next: NextFunction) => {
  try {

    const requestedUrl = req.url;
    if (handleAuthSkipUrls.includes(requestedUrl)) {
      return next();
    }

    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader && authorizationHeader?.startsWith('Bearer ')) {
      const token=authorizationHeader.split(" ")[1]
      const JWT_SECRET:any=process.env.JWT_SECRET
      jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(403).json({ message: 'Expired token' });
        }
        return res.status(403).json({ message: 'Invalid token' });
      }
      req.body.user=decoded
    });
      next();
    } else {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error });
  }
};