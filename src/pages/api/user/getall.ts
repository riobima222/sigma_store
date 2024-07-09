import { retriveData } from "@/lib/firebase/services";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const response = await retriveData("users");
    res.status(200).json(response);
  }
}
