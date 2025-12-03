import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Create the response object
        const response = NextResponse.json(
            { success: true, message: "Logout successful" }, // Added success: true for client-side check
            { status: 200 }
        );

        // Deleting the token cookie by setting its value to empty and maxAge to 0
        response.cookies.set("token", "", {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 0, // Setting maxAge to 0 immediately expires the cookie
            path: '/', // Ensure the cookie is deleted across all paths
        });

        return response;

    } catch (error) {
        console.error("Logout Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}