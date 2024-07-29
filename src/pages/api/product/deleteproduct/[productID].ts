import { NextApiRequest, NextApiResponse } from "next";
import { deleteProduct } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";
import { apiResponse } from "@/utils/apiResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { productID }: any = req.query;
    verifyToken(req, res, async () => {
      const response = await deleteProduct(productID);
      apiResponse(response, res, "berhasil terhapus");
    });
  }
}
