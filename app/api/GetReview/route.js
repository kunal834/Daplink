import Review from "@/models/Review";
import { NextResponse } from "next/server";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";


export async function GET(){

    try{
        const data  = await Review.find({})

        return NextResponse.json({
            success: true,
            data
        })

    }catch(error){

        return NextResponse.json({
        success: false,

        })

    }


}