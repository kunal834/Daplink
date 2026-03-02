import { connectDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import User from "@/models/user";
import Link from "@/models/Link";

export async function GET() {
  try {
    await connectDB();

    const alluser = await User.find({}).select("-password").populate("daplinkID");

    return NextResponse.json({
      success: true,
      error: false,
      result: alluser
    });

  } catch (error) {
    console.error("FETCH ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Internal Server Error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}