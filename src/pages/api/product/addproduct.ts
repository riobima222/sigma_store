import { NextApiRequest, NextApiResponse } from "next";
import { addProduct } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const data: any = req.body;
    verifyToken(req, res, async () => {
      const response = await addProduct(data);
      if (response) {
        res.status(200).json({
          statusCode: 200,
          message: "product berhasil di tambah",
          productID: response,
        });
      } else {
        res.status(200).json({ message: "error, periksa server" });
      }
    });
  }
}
