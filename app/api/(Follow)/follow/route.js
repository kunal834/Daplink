import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  await connectDB();

  try {
    const { currentUserId, targetUserId } = await req.json();

    if (!currentUserId || !targetUserId) {
      return Response.json({ error: "Missing IDs" }, { status: 400 });
    }
    
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const alreadyFollowing = currentUser.following.includes(targetUserId);

    if (alreadyFollowing) {
      // UNFOLLOW
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: targetUserId }
      });

      await User.findByIdAndUpdate(targetUserId, {
        $pull: { followers: currentUserId }
      });
    } else {
      // FOLLOW
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: targetUserId }
      });

      await User.findByIdAndUpdate(targetUserId, {
        $addToSet: { followers: currentUserId }
      });
    }

    const updatedTargetUser = await User.findById(targetUserId);

    return Response.json({
      isFollowing: !alreadyFollowing,
      followersCount: updatedTargetUser.followers.length
    });

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Server Error" }, { status: 500 });
  }
}
