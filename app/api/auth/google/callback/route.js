import { NextResponse } from 'next/server';
import connectDb from "@/db/connectDB";
import User from "@/models/user"; // Use your actual path

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  try {
    // 1. Exchange code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "http://localhost:3000/api/auth/google/callback",
        grant_type: "authorization_code",
      }),
    });

    const { id_token } = await tokenResponse.json();

    // 2. Get user info from ID Token
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`);
    const googleUser = await userResponse.json();

    console.log("ggoogle user" ,googleUser)

    // 3. Mongoose Logic: Find or Create User
    await connectDb();
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        username: googleUser.email.split("@")[0],
      });
    }

    // 4. Set Session/Cookie and Redirect
    // (You would typically set a JWT cookie here)
    const response = NextResponse.redirect(new URL('/Dashboard', request.url));
    return response;

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}