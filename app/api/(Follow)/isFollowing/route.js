import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const followerId = searchParams.get("followerId"); // Current user ID
    const followingId = searchParams.get("followingId"); // User to check

    if (!followerId || !followingId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Find the current user
    const user = await User.findById(followerId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if the followingId exists in the following array
    const isFollowing = user.following.includes(followingId);

    return NextResponse.json({ isFollowing });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
