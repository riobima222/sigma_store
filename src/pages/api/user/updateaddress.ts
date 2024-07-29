import { updateAddress } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiResponse, NextApiRequest } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await updateAddress(decoded.id, req.body);
      if (response) {
        res.status(200).json({ message: "berhasil" });
      } else {
        res.status(400).json({ message: "server error" });
      }
    });
  }
}
