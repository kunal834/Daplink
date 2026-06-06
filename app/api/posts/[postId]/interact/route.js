import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const { postId } = await params;
    const { action, optionIndex } = await req.json();

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // "view" action can be anonymous
    if (action === "view") {
      post.views = (post.views || 0) + 1;
      await post.save();
      return NextResponse.json(
        { success: true, views: post.views },
        { status: 200 }
      );
    }

    // Likes and voting require authentication
    let userId;
    try {
      userId = getDataFromToken(req);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Please log in to react or vote" },
        { status: 401 }
      );
    }

    if (action === "like") {
      const likesIndex = post.likes.indexOf(userId);
      if (likesIndex > -1) {
        // Unlike
        post.likes.splice(likesIndex, 1);
      } else {
        // Like
        post.likes.push(userId);
      }
      await post.save();
      return NextResponse.json(
        { success: true, liked: likesIndex === -1, likesCount: post.likes.length },
        { status: 200 }
      );
    }

    if (action === "vote") {
      if (post.type !== "poll") {
        return NextResponse.json(
          { success: false, message: "This post is not a poll" },
          { status: 400 }
        );
      }

      if (post.pollVoters.includes(userId)) {
        return NextResponse.json(
          { success: false, message: "You have already voted in this poll" },
          { status: 400 }
        );
      }

      const idx = Number(optionIndex);
      if (Number.isNaN(idx) || idx < 0 || idx >= post.pollOptions.length) {
        return NextResponse.json(
          { success: false, message: "Invalid poll option index" },
          { status: 400 }
        );
      }

      // Record vote
      post.pollOptions[idx].votes = (post.pollOptions[idx].votes || 0) + 1;
      post.pollVoters.push(userId);
      await post.save();

      return NextResponse.json(
        { success: true, pollOptions: post.pollOptions },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Post Interaction Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
