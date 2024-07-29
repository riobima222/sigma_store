import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";


export const verifyToken = (req: NextApiRequest, res:NextApiResponse, callback: Function) => {
    const token: any = req.headers.authorization?.split(" ")[1];
    if(token) {
      jwt.verify(
       token,
         process.env.NEXTAUTH_SECRET || "",
         async (err: any, decoded: any) => {
           if (decoded) {
             callback(decoded);
           } else {
             res.status(400).json({ message: "token e ora valid" });
           }
         }
       );
    } else {
      res.status(401).json({ message: "token e ora enek" })
    }
}