
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";

export async function POST(req) {
  const { username } = await req.json();

  if (!username) {
    return NextResponse.json(
      { error: "Username required" },
      { status: 400 }
    );
  }

  await connectDB();

  const exists = await Link.exists({ handle: username.toLowerCase() });

  return Response.json({
    available: !exists,
    message: exists ? "Handle already taken" : "Handle available",
  });
}
