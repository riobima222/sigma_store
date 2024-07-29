import { NextApiRequest, NextApiResponse } from "next";
import { updateDataProfile } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await updateDataProfile(req.body);
      if (response) {
        res.status(200).json({ message: "data profile berhasil di update" });
      } else {
        res.status(500).json({ message: "GAGAL update data profile" });
      }
    });
  }
}
