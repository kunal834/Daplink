import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const response = NextResponse.json(
            { success: true, message: "Logout successful" },
            { status: 200 }
        );

        // Delete the token cookie
        response.cookies.set("authtoken", "", {
            httpOnly: true,
            sameSite: "strict",
            path: "/",
            expires: new Date(0), 
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
