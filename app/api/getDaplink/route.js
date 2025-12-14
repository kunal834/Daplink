import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const daplinkID = searchParams.get("daplinkID");
        if (!daplinkID) {
            return Response.json({ error: "Missing daplink ID" }, { status: 400 });
        }
        const daplinkData = await Link.findOne({ _id: new mongoose.Types.ObjectId(daplinkID) });
        if(!daplinkData){
            return Response.json({ error: "Daplink not found" }, { status: 404 });
        }

        return Response.json(daplinkData);
    }
    catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}
