// app/api/qr/save/route.js
import { NextResponse } from 'next/server';
import Qrmodel from '@/models/qrcode';
import { getDataFromToken } from '@/app/Helper/getDataFromToken';
import User from '@/models/user';

export async function POST(req) {

  try {
const session = await getDataFromToken(req); // Get logged in user
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  console.log("session data" , session)
  const data = await req.json();
  console.log("data from client:", data);
  
  // --- FEATURE GATING LOGIC ---
  const user = await User.findById(session);
  const qrCount = await Qrmodel.countDocuments({ userId: user._id });

  console.log('session user:', session.user);

  if (user.plan === 'free' && qrCount >= 3) {
    return NextResponse.json({ 
      error: "Free limit reached. Upgrade to Pro to save more QR codes!" 
    }, { status: 403 });
  }

  const newQR = await Qrmodel.create({
    success: true,
    userId: user._id,
    title: data.title,
    url: data.url,
    config: data.config,
    qrcount: qrCount 
  });

  return NextResponse.json({ success: true, qr: newQR });
  }
  catch (error) {
    console.error("Error saving QR code:", error);
    return NextResponse.json({ error: "Failed to save QR code" }, { status: 500 });
  } 
  
}