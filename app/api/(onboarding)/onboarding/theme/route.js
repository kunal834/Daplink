import { getAuthUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import { NextResponse } from "next/server";


export async function POST(req) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { theme } = await req.json();

  await connectDB();

  await Link.updateOne(
    { userId: user._id },
    { theme }
  );

  const data= await Link.findOne({userId: user._id});
  // console.log("Theme updated for user:", data);
  return NextResponse.json({ success: true , data : data});
}
