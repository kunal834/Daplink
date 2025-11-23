//SSapi endpoint for data fetching to view on screen

import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { handle } = params;

    if (!handle) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "Missing required parameter: handle",
          result: null,
        },
        { status: 400 }
      );
    }

    const data = await Link.findOne({ handle });

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          error: true,
          message: "User not found",
          result: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      error: false,
      result: data,
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


