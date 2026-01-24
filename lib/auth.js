import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";

export async function getAuthUser() {
  try {
    // ✅ Next.js 15: cookies() is async-safe here
    const cookieStore = cookies();
    const token = cookieStore.get("authtoken")?.value;

    if (!token) return null;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT VERIFY FAILED:", err.message);
      return null;
    }

    if (!decoded?.id) return null;

    await connectDB();

    const user = await User.findById(decoded.id).select("-password");

    if (!user) return null;

    return user;
  } catch (err) {
    console.error("getAuthUser ERROR:", err);
    return null;
  }
}
