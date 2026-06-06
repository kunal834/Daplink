import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "@/models/Link";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";

export async function POST(req) {
  try {
    await connectDB();
    
    let userIdFromToken;
    try {
      userIdFromToken = getDataFromToken(req);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Please authenticate first" },
        { status: 401 }
      );
    }

    // Get handle from user's Link profile
    const profile = await Link.findOne({ userId: userIdFromToken });
    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Please create a profile handle first before posting." },
        { status: 400 }
      );
    }

    const { type = "text", content, pollOptions = [], audioUrl = "" } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: "Post content is required" },
        { status: 400 }
      );
    }

    const newPostData = {
      authorId: userIdFromToken,
      handle: profile.handle,
      type,
      content: content.trim(),
    };

    if (type === "poll") {
      if (!Array.isArray(pollOptions) || pollOptions.length < 2) {
        return NextResponse.json(
          { success: false, message: "A poll requires at least 2 options" },
          { status: 400 }
        );
      }
      newPostData.pollOptions = pollOptions
        .map(opt => ({ optionText: String(opt).trim(), votes: 0 }))
        .filter(opt => opt.optionText);
    }

    if (type === "audio") {
      if (!audioUrl || !audioUrl.trim()) {
        return NextResponse.json(
          { success: false, message: "Audio URL is required for voice posts" },
          { status: 400 }
        );
      }
      newPostData.audioUrl = audioUrl.trim();
    }

    const newPost = await Post.create(newPostData);

    return NextResponse.json(
      { success: true, message: "Post created successfully", post: newPost },
      { status: 201 }
    );

  } catch (error) {
    console.error("Create Post Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const handle = searchParams.get("handle");

    let query = {};
    if (handle) {
      query.handle = handle.toLowerCase();
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate("authorId", "name email");

    return NextResponse.json(
      { success: true, posts },
      { status: 200 }
    );

  } catch (error) {
    console.error("Get Posts Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
