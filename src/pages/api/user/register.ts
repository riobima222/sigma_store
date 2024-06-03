import { signUp } from "@/lib/firebase/services";
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === `POST`) {
    const response = await signUp(req.body);
    if (response?.code === 200) {
      res.status(200).json({ statusCode: 200, message: `Berhasil mendaftar` });
    } else if (response?.code === 400) {
      res?.status(200).json({ statusCode: 400, message: `Akun sudah ada` });
    } else {
      res
        ?.status(500)
        .json({ statusCode: 500, message: `Terjadi kesalahan pada server` });
    }
  }
}
