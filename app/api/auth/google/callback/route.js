import { NextResponse } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import User from "@/models/user"; 

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

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
  console.log(tokenData)

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
 
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        image: googleUser.picture,
        username: googleUser.email.split("@")[0],
      });
    }

    console.log(user);
    


  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_HOST}/Dashboard`);

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}