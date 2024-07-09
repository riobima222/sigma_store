import { deleteUser } from "@/lib/firebase/services";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "DELETE") {
    const { username } = req.query;
    const token: any = req.headers.authorization?.split(" ")[1];
    res.status(200).json({ statusCode: 200, message: `delete berhasil` });
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decode: any) => {
        if (decode) {
          const response = await deleteUser(username as string);
          if (response) {
            res
              .status(200)
              .json({ statusCode: 200, message: `delete berhasil` });
          } else {
            res.status(500).json({ statusCode: 500, message: `delete gagal` });
          }
        } else {
          res
            .status(500)
            .json({ statusCode: 500, message: `access token gagal` });
        }
      }
    );
  }
}
