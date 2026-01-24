import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import { NextResponse } from "next/server";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { profile, script, profession } = await req.json();

  await connectDB();

  await Link.updateOne(
    { userId: user._id },
    {
      profile,
      script,
      profession
    }
  );

  return NextResponse.json({ success: true });
}
