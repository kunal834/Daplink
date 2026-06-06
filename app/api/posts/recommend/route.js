import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import Link from "@/models/Link";

export async function GET(req) {
  try {
    await connectDB();

    // 1. Fetch all posts
    const posts = await Post.find({}).lean();

    // 2. Fetch all link profiles to attach name, profile avatar, statusGlow, avatarBorder
    const profiles = await Link.find({}).select("handle name profile statusGlow avatarBorder").lean();
    
    // Create a map of handle -> profile info
    const profileMap = {};
    profiles.forEach(p => {
      if (p.handle) {
        profileMap[p.handle.toLowerCase()] = {
          name: p.name || "",
          profile: p.profile || "",
          statusGlow: p.statusGlow || "online",
          avatarBorder: p.avatarBorder || "classic"
        };
      }
    });

    // 3. Compute scores and map posts
    const now = new Date();
    const scoredPosts = posts.map(post => {
      const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
      const pollVotesCount = Array.isArray(post.pollOptions) 
        ? post.pollOptions.reduce((acc, opt) => acc + (opt.votes || 0), 0)
        : 0;
      const viewsCount = post.views || 0;
      
      const createdAt = new Date(post.createdAt || post.updatedAt || now);
      const ageInHours = Math.max(0, (now - createdAt) / (1000 * 60 * 60));
      
      // Hacker News formula
      const score = (likesCount + (pollVotesCount * 1.5) + (viewsCount * 0.1)) / Math.pow(ageInHours + 2, 1.5);
      
      const authorInfo = profileMap[post.handle.toLowerCase()] || {
        name: post.handle,
        profile: "",
        statusGlow: "online",
        avatarBorder: "classic"
      };

      return {
        ...post,
        score,
        authorInfo
      };
    });

    // 4. Sort by score descending
    scoredPosts.sort((a, b) => b.score - a.score);

    return NextResponse.json(
      { success: true, posts: scoredPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Recommend Posts Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
