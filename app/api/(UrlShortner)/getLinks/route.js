import { connectDB } from "@/lib/mongodb";
import ShortURL from "@/models/ShortUrl";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";

import mongoose from "mongoose";

export async function GET(req) {
    try {
        await connectDB();
        const userID = getDataFromToken(req);
       console.log(userID);
        if (!userID) {
            return Response.json({ error: "Missing userID" }, { status: 400 });
        }
        const Links = await ShortURL.find({ createdBy: new mongoose.Types.ObjectId(userID) });
        if(!Links){
            return Response.json({ error: "Links not found" }, { status: 404 });
        }
        return Response.json(Links);
    }
    catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}