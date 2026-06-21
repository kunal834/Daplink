import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const { token } = await req.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token is required" },
                { status: 400 }
            );
        }

        // STEP 1: Find the user ONLY by the token first (removes MongoDB timezone query issues)
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return NextResponse.json(
                { success: false, message: "Invalid token. User not found." },
                { status: 400 }
            );
        }

        // STEP 2: Check expiry inside JavaScript code using clean timestamps
        const expiryTime = new Date(user.verificationTokenExpires).getTime();
        const currentTime = new Date().getTime();

        if (currentTime > expiryTime) {
            return NextResponse.json(
                { success: false, message: "Verification link has expired" },
                { status: 400 }
            );
        }

        // STEP 3: Explicitly update the document fields directly
        user.emailVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        return NextResponse.json({
            success: true,
            message: "Email verified successfully!",
        });

    } catch (error) {
        console.error("Verification Route Critical Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}