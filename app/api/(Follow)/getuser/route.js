import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import mongoose from "mongoose";

export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get("daplinkID");

        if (!userid) {
            return Response.json({ error: "Missing user ID" }, { status: 400 });
        }
        const user = await User.findOne({
            daplinkID: new mongoose.Types.ObjectId(userid)
        });

        if (!user) {
            return Response.json({ error: "User not found" }, { status: 404 });
        }
        
        return Response.json({ userId: user._id,follower: user.followers,following:user.following }, { status: 200 });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
}