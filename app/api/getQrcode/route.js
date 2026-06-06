import { NextResponse } from "next/server";
import Qrmodel from '@/models/qrcode';
import { getDataFromToken } from '@/app/Helper/getDataFromToken';



export async function GET(req) {

    try{
    const session = await getDataFromToken(req); // Get logged in user
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  console.log("session data" , session)
  const qrcodes = await Qrmodel.find({ userId: session }).sort({ createdAt: -1 });
  return NextResponse.json({ success: true, qrcodes });
  

    }
    catch(error){
        console.error("Error fetching QR code:", error);
        return NextResponse.json({ error: "Failed to fetch QR code" }, { status: 500 });
    }


}