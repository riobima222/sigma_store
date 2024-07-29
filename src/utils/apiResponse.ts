import { NextApiResponse } from "next";

export const apiResponse = (
  response: any,
  res: NextApiResponse,
  message: string
) => {
  if (!response) {
    res.status(400).json({ message: "koneksi ke database error" });
  } else [res.status(200).json({ message })];
};
