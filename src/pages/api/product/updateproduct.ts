import { NextApiRequest, NextApiResponse } from "next";
import { updateProduct } from "@/lib/firebase/services";
import { verifyToken } from "@/utils/verifyToken";
import { apiResponse } from "@/utils/apiResponse";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const data = req.body;
    verifyToken(req, res, async () => {
      const response = await updateProduct(data);
      apiResponse(response, res, "berhasil update product");
    });
  }
}
