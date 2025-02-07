import { Request, Response } from "express";
import { prisma } from "../../../utils/prisma";
import { checkPassword, encryptPassword } from "../../../utils/encrypt";
import { generateToken } from "../../../utils/token-generate";
import { compare } from "bcrypt";
const jwt = require("jsonwebtoken");
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, phone } = req.body;
    // console.log(req.body);
    const exist = await prisma.superAdmin.findFirst({
      where: {
        OR: [{ email }, { phone }],
        // password: await encryptPassword(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        password: true,
      },
    });
    if (exist && (await checkPassword(password, exist?.password))) {
      const token = await generateToken({
        id: exist?.id,
        name: exist?.name,
        email: exist?.email,
        phone: exist?.phone,
      });

      return res
        .status(201)
        .json({
          message: "Login successful.",
          data: {
            ...{
              id: exist?.id,
              name: exist?.name,
              email: exist?.email,
              phone: exist?.phone,
            },
            token,
          },
        });
    } else {
      return res.status(400).json({ message: "Email or password miss match." });
    }
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ message: "Something went wrong.", error: e });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    // console.log(name, email, phone, password, confirmPassword);
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({error:{message: "Password and confirm Password doesn't match." }});
    }
    const exist = await prisma.superAdmin.findFirst({
      where: {
        OR: [{ email }, { name }, { phone }],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
    });
    // console.log(exist);
    if (exist) {
      const conflictedField =
        exist?.email === email
          ? "Email"
          : exist?.phone === phone
          ? "phone"
          : "name";
      return res
        .status(400)
        .json({ error:{message: `${conflictedField} already exist.` }});
    }

    const superAdmin = await prisma.superAdmin.create({
      data: {
        name,
        email,
        phone,
        password: await encryptPassword(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        password: true,
      },
    });
    const token = await generateToken({
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      phone: superAdmin.phone,
    });
    res.status(201).json({
      message: "Successfully registered.",
      data: { ...superAdmin, token: token },
    });
  } catch (e: any) {
    res.status(500).json({error:{ message: "Something went wrong", error: e }});
  }
};
