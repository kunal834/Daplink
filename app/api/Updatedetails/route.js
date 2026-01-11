import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";
export async function PUT(req){
   
    try{
        const body =  await req.json();
    await connectDB();
        const { handle, profile , link , location ,  profession , skillsoff } = body;

       const { searchParams } = new URL(req.url);
        const daplinkid = searchParams.get("daplinkID");
 
     console.log("daplinkiduser" , daplinkid)

     if(!daplinkid){
        return NextResponse.json({
            success : false,
            message: "UnAuthorized user log in please"
        })
     }
    const updatedData ={
        handle, profile , link , location ,  profession , skillsoff
    }
  if (handle) {
      updatedData.handle = handle;
    }
    const updateduser = await Link.findByIdAndUpdate(daplinkid,
      updatedData,
      { new: true, runValidators: true } // runValidators ensures schema rules are checked
    )
    
    if (!updateduser) {
    return NextResponse.json({
        success: false,
        message: "No profile found for this user ID. Check if the ID matches.",
    }, { status: 404 });
}
    
 return  NextResponse.json({ 
            success : true,
            nessage : "Your profile updated successfully",
            updateduser
        },{ status: 200 })
 
        
    }catch(error){
      return NextResponse.json({
      success: false,
      message: error.message,
    }, { status: 500 });

    }

}
