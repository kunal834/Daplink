import { connectDB } from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import Link from "@/models/Link";


export async function GET(){
    try{
        await connectDB();
        
        const alluser = await Link.find({});
        return NextResponse.json({
            success: true,
            error: false,
            result: alluser
        });
     } catch (error) {
        console.error("FETCH ERROR:", error);
        return NextResponse.json(
          {
            success: false,
            error: true,
            message: "Internal Server Error",
            details: error.message,
          },
          { status: 500 }
        );
      }      

}
