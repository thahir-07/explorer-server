import { error } from "console";

const jwt = require("jsonwebtoken");

export const generateToken = async (
  payload: object,
  secret: string = process.env.JWT_SECRET as string,
  expiresIn: string = "7d"
): Promise<string> => {
  try {
    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  } catch (err) {
    console.error("Error signing token:", err);
    throw err; 
  }
};