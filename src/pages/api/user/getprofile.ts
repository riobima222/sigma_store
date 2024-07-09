import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { retriveDataByID } from "@/lib/firebase/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "",
        async (err: any, decode: any) => {
          if (decode) {
            const response = await retriveDataByID("users", decode.id);
            if (!response) {
              res
                .status(500)
                .json({ statusCode: 500, message: `koneksi database error` });
            } else {
              res.status(200).json({
                statusCode: 200,
                message: "berhasil get profile",
                data: response,
              });
            }
          } else {
            res
              .status(500)
              .json({ statusCode: 500, message: `token tidak valid` });
          }
        }
      );
    } else {
      res.status(500).json({ statusCode: 500, message: `token tidak ada` });
    }
  }
}
