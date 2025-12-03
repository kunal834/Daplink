import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";


export async function GET() {
  try {
    await connectDB();

    // MUST await in Next.js 15+
    const cookieStore = await cookies();
    const token = cookieStore.get("authtoken")?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error("ME ROUTE ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
