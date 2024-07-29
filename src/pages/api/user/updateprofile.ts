import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { updateProfile } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const imageURL = req.body.imageURL;
    verifyToken(req, res, async (decoded: any) => {
      const response = await updateProfile(decoded.username, imageURL);
      if (response) {
        res
          .status(200)
          .json({ statusCode: 200, message: "profile berhasil diganti" });
      } else {
        res
          .status(500)
          .json({ statusCode: 500, message: "profile gagal diganti" });
      }
    });
  }
}
