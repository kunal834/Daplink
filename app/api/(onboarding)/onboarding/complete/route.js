import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  await User.updateOne(
    { _id: user._id },
    {
      isProfileComplete: true,
      "onboarding.completed": true,
      "onboarding.currentStep": 999
    }
  );

  return NextResponse.json({ success: true });
}
