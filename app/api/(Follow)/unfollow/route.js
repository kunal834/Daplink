import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(request) {
    await connectDB();
    try {
        const { followerId, followingId } = await request.json();
        await User.findByIdAndUpdate(followerId, {
            $pull: { following:followingId }
        });
        await User.findByIdAndUpdate(followingId, {
            $pull: { followers: followerId }
        });
        return new Response("Unfollowed successfully", { status: 200 });
    } catch (error) {
        return new Response("Error unfollowing user", { status: 500 });
    }
}