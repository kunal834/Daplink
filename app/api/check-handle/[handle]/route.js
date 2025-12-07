import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";


export async function GET(request, { params }) {
  await connectDB();

  const { handle } = params;

  if (!handle || handle.trim() === "") {
    return Response.json({ available: false, message: "Invalid handle" });
  }

  const exists = await Link.findOne({ handle });

  return Response.json({
    available: !exists,
    message: exists ? "Handle already taken" : "Handle available",
  });
}
