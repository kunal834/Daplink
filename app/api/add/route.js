import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body?.handle || !body?.url) {
      return Response.json(
        {
          success: false,
          error: true,
          message: "Required fields missing: handle or url",
        },
        { status: 400 }
      );
    }

    // Check if handle already exists
    const existing = await Link.findOne({ handle: body.handle });

    if (existing) {
      return Response.json(
        {
          success: false,
          error: true,
          message: "Daplink already exists!",
          result: null,
        },
        { status: 409 } // conflict
      );
    }

    // Create new entry
    const newLink = await Link.create(body);

    return Response.json(
      {
        success: true,
        error: false,
        message: "Daplink created successfully",
        result: newLink,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Link Error:", error);
    return Response.json(
      {
        success: false,
        error: true,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
