import Review from "@/models/Review";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";

export  async function POST(req){
    try{

          const {clientname , profession , rating ,message} = await req.json(); 

          const userId = await getDataFromToken(req); // accessing token from helper function which is access it from cookie

    const Newreview = await Review.create({
           targetUser: userId,
           clientname , 
           profession ,
            rating ,
            message 

    })
   
    return NextResponse.json({
        success: true,
        userId,
        Newreview : Newreview


    })

    }catch(error){
       return NextResponse.json(
        {success: false,
        message: error.message || "Internal server error"}
        )

    }

  


    

}