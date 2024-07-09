import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { updateProfile } from "@/lib/firebase/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const imageURL = req.body.imageURL;
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      jwt.verify(
        token,
        process.env.NEXTAUTH_SECRET || "",
        async (err: any, decode: any) => {
          if (decode) {
            const response = await updateProfile(decode.username, imageURL);
            if (response) {
              res
                .status(200)
                .json({ statusCode: 200, message: "profile berhasil diganti" });
            } else {
              res
                .status(500)
                .json({ statusCode: 500, message: "profile gagal diganti" });
            }
          } else {
            res
              .status(500)
              .json({ statusCode: 500, message: `token tidak valid` });
          }
        }
      );
    } else {
      res.status(500).json({ statusCode: 500, message: `tidak ada token` });
    }
  }
}
