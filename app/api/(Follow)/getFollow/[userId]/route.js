import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import "@/models/Link"; // IMPORTANT: forces model registration
import User from "@/models/user";

// import User from "@/models/user";


export async function GET(req, { params }) {
  try {
    await connectDB();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    // 3. Fetch user with followers & following
    const user = await User.findById(userId)
      .select("followers following")
      .populate({
        path: "followers",
        select: "_id name email daplinkID",
        populate: {
          path: "daplinkID",
          select: "profile handle"
        }
      })
      .populate({
        path: "following",
        select: "_id name email daplinkID",
        populate: {
          path: "daplinkID",
          select: "profile handle"
        }
      });

    // 4. Handle not found
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 5. Success response
    return NextResponse.json(
      {
        followers: user.followers,
        following: user.following
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getFollowData error:", error);
    return NextResponse.json(
      { message: "Failed to fetch follow data" },
      { status: 500 }
    );
  }
}
