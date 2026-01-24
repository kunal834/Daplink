import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import { NextResponse } from "next/server";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { links } = await req.json();

  if (!Array.isArray(links)) {
    return NextResponse.json({ error: "Invalid links" }, { status: 400 });
  }

  await connectDB();

  await Link.updateOne(
    { userId: user._id },
    { links }
  );

  return NextResponse.json({ success: true });
}
