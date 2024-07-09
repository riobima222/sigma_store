import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { changePassword } from "@/lib/firebase/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "",
        async (err: any, decode: any) => {
          if (decode) {
            const response = await changePassword(decode.username, req.body);
            if (response) {
              res.status(200).json({ statusCode: 200, message: "berhasil ganti password" });
            } else {
              res.status(200).json({ statusCode: 400 ,message: "server error bolo" });
            }
          } else {
            res.status(500).json({ message: "token tidak valid" });
          }
        }
      );
    } else {
      res.status(500).json({ message: "token tidak ada" });
    }
  }
}
