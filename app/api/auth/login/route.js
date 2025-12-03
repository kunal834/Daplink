import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectDB();

        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and Password are required" },
                { status: 400 }
            );
        }

        //Checking if user exists
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { message: "User does not exist" },
                { status: 401 }
            );
        }

        // Checking if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Creating a  JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 200 }
        );

        // Storing token in Cookies
        response.cookies.set("authtoken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60, // 60 minutes
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

