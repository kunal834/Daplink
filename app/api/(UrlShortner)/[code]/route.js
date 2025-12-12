import { connectDB } from "@/lib/mongodb";
import ShortURL from "@/models/ShortUrl";

export async function GET(res, { params }) {
    try {
        connectDB();
        const { code } = await params;
        const Link = await ShortURL.findOneAndUpdate({
            shortCode: code,
            isActive: true
        }, {
            $inc: { clicks: 1 }
        }, { new: true });
        if (!Link) {
            return new Response(JSON.stringify({ error: "Link not found or inactive" }), { status: 404 });
        }
        return new Response(JSON.stringify({ originalUrl: Link.originalUrl }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }

}