import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user"; 
import { cookies } from 'next/headers'; // Use Next.js built-in cookie utility
import jwt from 'jsonwebtoken'

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');//Temporary Hand-off: Instead of sending sensitive data like an email directly to the browser (which is insecure),
  console.log("code" , code)

  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  try {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.NEXT_PUBLIC_HOST}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log("tokendata" , tokenData)

  if (!tokenResponse.ok) {
  
    console.error("Google Exchange Error Details:", tokenData);
    return NextResponse.json({ error: tokenData.error_description || "Auth failed" }, { status: 401 });
  }

  const { id_token } = tokenData;

console.log("Using Client ID:", process.env.GOOGLE_CLIENT_ID);
    
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${id_token}`);
    const googleUser = await userResponse.json();

    console.log("google user" ,googleUser)

    
    await connectDB();
    let user = await User.findOne({ email: googleUser.email });
    console.log("user of daplink" , user)
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
      });
    }

    console.log(user);
    
 const token = jwt.sign(
  { id: user._id, email: user.email },
    process.env.JWT_SECRET, // Make sure this is in your .env
    
 )
  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/Dashboard`);

response.cookies.set("authtoken", token, {
    httpOnly: true, // Prevents JS access (security)
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

 return response;


  } catch (error) {
    console.log("Google Auth Error:", error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}