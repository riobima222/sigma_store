import { NextApiRequest, NextApiResponse } from "next";
import { addAddress, changePassword } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const tambahAlamatBaru = req.body;
    verifyToken(req, res, async (decoded: any) => {
      const response = await addAddress(tambahAlamatBaru, decoded.id);
      if (response) {
        res
          .status(200)
          .json({ statusCode: 200, message: "alamat berhasil di tambahkan" });
      } else {
        res.status(200).json({ statusCode: 400, message: "server error bolo" });
      }
    });
  }
}