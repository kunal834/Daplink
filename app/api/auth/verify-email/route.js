import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { token } = await req.json();

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: {
                $gt: new Date(),
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired token",
                },
                { status: 400 }
            );
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email verified successfully",
        });

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Server error",
            },
            { status: 500 }
        );
    }
}