import { connectDB } from "@/lib/mongodb";
import LinkModel from "@/models/Link"; // Make sure this matches your file name
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // 1. Destructure the data coming from "submitlink" in Generate.js
    const { handle, links, profile, script, mindset, skillsoff, skillsseek } = body;

    // 2. Validation: Only 'handle' is strictly required to start
    if (!handle) {
      return NextResponse.json(
        { success: false, error: true, message: "Handle is required!" },
        { status: 400 }
      );
    }

    // 3. The Fix: Use findOneAndUpdate with 'upsert: true'
    // - If the handle exists -> It UPDATES the data (Save changes)
    // - If the handle doesn't exist -> It CREATES a new one
    const updatedProfile = await LinkModel.findOneAndUpdate(
      { handle: handle }, // Find criteria
      { 
        handle, 
        links, 
        profile, 
        script, 
        mindset, 
        skillsoff: skillsoff || [], // Ensure arrays are at least empty lists
        skillsseek: skillsseek || [] 
      }, // Data to save
      { new: true, upsert: true, setDefaultsOnInsert: true } // Options
    );

    return NextResponse.json(
      {
        success: true,
        error: false,
        message: "Daplink saved successfully!",
        result: updatedProfile,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Save Link Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: true,
        message: "Server error: " + error.message,
      },
      { status: 500 }
    );
  }
}