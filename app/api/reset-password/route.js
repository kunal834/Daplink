import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { resetPasswordLimiter } from "@/lib/ratelimit";

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        
        try {
            await resetPasswordLimiter.consume(ip);
        } catch (rateLimiterRes) {
            return NextResponse.json(
                { message: "Too many attempts. Please try again later." }, 
                { 
                    status: 429,
                    headers: {
                        "Retry-After": Math.round(rateLimiterRes.msBeforeNext / 1000).toString(),
                    }
                }
            );
        }

        await connectDB();
        const { token, newPassword } = await req.json();

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json({ message: "Token is invalid or has expired." }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        return NextResponse.json({ message: "Password reset successful. You can now log in." }, { status: 200 });

    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json({ message: "An error occurred updating the password." }, { status: 500 });
    }
}