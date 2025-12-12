import { connectDB } from "@/lib/mongodb";
import ShortURL from "@/models/ShortUrl";
import { generateShortCode } from "@/utils/GenerateShortCode";


export async function POST(request) {
    try {
        await connectDB();
        const { url, customCode, userId } = await request.json();

        if (!url) {
            return new Response(JSON.stringify({ error: "URL is required" }), { status: 400 });
        }
        if(userId===undefined){
            return new Response(JSON.stringify({ error: "User not authenticated" }), { status: 401 });
        }
        if (customCode) {
            const existingLink = await ShortURL.findOne({ customCode });
            if (existingLink) {
                return new Response(JSON.stringify({ error: "Custom code already in use" }), { status: 400 });
            }
        }
        let shortCode = customCode || generateShortCode(8);
        let exists = await ShortURL.findOne({ shortCode });
        let attempts = 0;
        while (exists && attempts < 5) {
            shortCode = generateShortCode();
            exists = await ShortURL.findOne({ shortCode });
            attempts++;
        }
        if (exists) return new Response(JSON.stringify({ message: 'could not generate unique code' }), { status: 500 });
        await ShortURL.create({
            originalUrl: url,
            shortCode,
            createdBy: userId,
        });
        return new Response(JSON.stringify({ message: "ShortUrl created successfully", code: shortCode }), { status: 201 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }

}