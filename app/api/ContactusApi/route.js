
import UserQuerymodel from "@/models/Contact"
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function  POST(req ) {

    try{
 const body = await req.json();
        await connectDB();
      const { name, email, subject, moredetails } = body;

const userQuery = await UserQuerymodel.create({
  name,
  email,
  subject,
  moredetails
});

       return  NextResponse.json({ 
            success : true,
            nessage : "Your Query Submitted",
            userQuery
        })
    }catch(error){  
    return NextResponse.json({
    success: false,
message: error.message,

});
    }
}