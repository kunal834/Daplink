// api endpoint for data fetching to view on screen
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
 
export async function GET(request, { params }) {
  const client = await clientPromise;
  const db = client.db("Daplink");
  const collection = db.collection("links");
  const handle = params.handle;
  const data = await collection.findOne({ handle });
  if (!data) {
    return NextResponse.json({ success: false, error: true, message: "User not found", result: null });
  }
  return NextResponse.json({ success: true, error: false, result: data });
}
