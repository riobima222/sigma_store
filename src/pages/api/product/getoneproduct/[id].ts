import { retriveDataByID } from "@/lib/firebase/services";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        const id: any = req.query.id;
        const response = await retriveDataByID("products", id);
        if(!response) {
            res.status(500).json({message: "ada masalah dengan database"})
        } else {
            res.status(200).json({data: response})
        }
    }
}