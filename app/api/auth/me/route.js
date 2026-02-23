import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import Link from "@/models/Link";

export async function GET() {
  try {
    await connectDB();

    // MUST await in Next.js 15
    const cookieStore = await cookies();
     console.log("Cookies:", cookieStore);
    const token = cookieStore.get("authtoken")?.value;
    console.log("Token from google:", token);

    if (!token) {
      return NextResponse.json({ user: null });
    }

    // verify JWT safely
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT ERROR:", error);
      return NextResponse.json({ user: null });
    }

    if (!decoded?.id) {
      return NextResponse.json({ user: null });
    }

    const user = await User.findById(decoded.id).select("-password").populate("daplinkID");
    // console.log("userin me", user);

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });

  } catch (err) {
    console.error("ME ROUTE ERROR:", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
