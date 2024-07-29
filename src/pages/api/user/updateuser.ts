import { updateUser } from "@/lib/firebase/services";
import { NextApiResponse, NextApiRequest } from "next";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await updateUser(req.body);
      if (response) {
        res.status(200).json({ statusCode: 200, message: `update berhasil` });
      } else {
        res.status(500).json({ statusCode: 500, message: `update gagal` });
      }
    });
  }
}
