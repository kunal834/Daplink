import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { forgotPasswordLimiter } from "@/lib/ratelimit";

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        
        try {
            await forgotPasswordLimiter.consume(ip);
        } catch (rateLimiterRes) {
            return NextResponse.json(
                { message: "Too many requests. Please try again later." }, 
                { 
                    status: 429,
                    headers: {
                        "Retry-After": Math.round(rateLimiterRes.msBeforeNext / 1000).toString(),
                    }
                }
            );
        }

        await connectDB();
        const { email } = await req.json();

        const user = await User.findOne({ email });
        
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        
        const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        
        const passwordResetExpires = Date.now() + 15 * 60 * 1000;

        user.resetPasswordToken = passwordResetToken;
        user.resetPasswordExpires = passwordResetExpires;
        await user.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
        
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: `"DapLink Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset. Please click the button below to set a new password. This link expires in 15 minutes.</p>
                <a href="${resetUrl}" style="background-color: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                <p>If you didn't request this, you can safely ignore this email.</p>
            `
        });

        return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });

    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "An error occurred. Please try again later." }, { status: 500 });
    }
}