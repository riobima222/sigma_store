import { NextApiRequest, NextApiResponse } from "next";
import { addToCart, cartDelete, getCarts } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";
import { apiResponse } from "@/utils/apiResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    verifyToken(req, res, async (decoded: { id: string }) => {
      const response = await addToCart(data, decoded.id);
      apiResponse(response, res, "product berhasil di tambah ke cart");
    });
  } else if (req.method === "GET") {
    verifyToken(req, res, async (decoded: any) => {
      const response = await getCarts(decoded.id);
      if (response.status === true) {
        res.status(200).json({
          message: "berhasil mengambil carts",
          cart: response.cart,
        });
      } else if (response === "kosong") {
        res.status(200).json({ message: "kosong", cart: response });
      } else {
        res.status(400).json({ message: "koneksi ke database error" });
      }
    });
  } else if (req.method === "PUT") {
    verifyToken(req, res, async () => {
      const response = await cartDelete(req.body);
      apiResponse(response, res, "berhasil hapus carts");
    });
  }
}
export const config = {
  api: {
    externalResolver: true,
  },
};
