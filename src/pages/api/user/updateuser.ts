import { updateUser } from "@/lib/firebase/services";
import { NextApiResponse, NextApiRequest } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(500).json({ statusCode: 500, message: `token tidak ada` });
    } else {
      jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "",
        async (err: any, decode: any) => {
          if (err) {
            res
              .status(500)
              .json({ statusCode: 500, message: `token tidak valid` });
          } else {
            const response = await updateUser(req.body);
            if (response) {
              res
                .status(200)
                .json({ statusCode: 200, message: `update berhasil` });
            } else {
              res
                .status(500)
                .json({ statusCode: 500, message: `update gagal` });
            }
          }
        }
      );
    }
  }
}
