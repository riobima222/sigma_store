import { retriveProducts } from "@/lib/firebase/services";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const response = await retriveProducts();
    if (response) {
      res.status(200).json({ statusCode: 200, data: response });
    } else {
      res.status(200).json({ statusCode: 500, message: "no data" });
    }
  }
}
