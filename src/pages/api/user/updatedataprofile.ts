import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { updateDataProfile } from "@/lib/firebase/services";

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
            const response = await updateDataProfile(req.body);
            if (response) {
              res
                .status(200)
                .json({ message: "data profile berhasil di update" });
            } else {
              res.status(500).json({ message: "GAGAL update data profile" });
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
