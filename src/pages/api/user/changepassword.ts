import { NextApiRequest, NextApiResponse } from "next";
import { changePassword } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await changePassword(decoded.email, req.body);
      if (response) {
        res
          .status(200)
          .json({ statusCode: 200, message: "berhasil ganti password" });
      } else {
        res.status(200).json({ statusCode: 400, message: "server error bolo" });
      }
    });
  }
}
