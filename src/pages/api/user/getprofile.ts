import { NextApiRequest, NextApiResponse } from "next";
import { retriveDataByID } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await retriveDataByID("users", decoded.id);
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
    });
  }
}
