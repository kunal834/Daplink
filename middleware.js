import { NextResponse } from "next/server";

export function middleware(request) {
    const { pathname } = request.nextUrl;

    
    if (pathname.startsWith("/Dashboard")) {
        const token = request.cookies.get("authtoken")?.value;

        // Not logged in → redirect
        if (!token) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }
    }

    return NextResponse.next();
}
export const config = {
    matcher: ["/Dashboard/:path*"],
};