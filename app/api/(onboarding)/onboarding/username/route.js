import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { username } = await req.json();
  if (!username) {
    return NextResponse.json({ error: "Username required" }, { status: 400 });
  }

  await connectDB();

  // prevent username overwrite
  const existingUser = await User.findById(user._id);
  if (existingUser.daplinkID) {
    return NextResponse.json(
      { error: "Username already set" },
      { status: 403 }
    );
  }

  const linkDoc = await Link.create({
    userId: user._id,
    handle: username.toLowerCase()
  });

  await User.updateOne(
    { _id: user._id },
    {
      daplinkID: linkDoc._id,
      "onboarding.currentStep": 2
    }
  );

  return NextResponse.json({ success: true });
}
