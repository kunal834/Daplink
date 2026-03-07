import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const token = (await cookies()).get("authtoken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, token });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to get socket token", error: error.message },
      { status: 500 }
    );
  }
}
