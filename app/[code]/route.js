import { connectDB } from "@/lib/mongodb";
import ShortURL from "@/models/ShortUrl";

// GET /:code - Redirect to original URL --> this is a Short URL redirect handler    
export async function GET(res, { params }) {
    try {
        await connectDB();
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

        let targetUrl = Link.originalUrl;

        // Smart Rules Redirection Engine
        if (Link.rules && Link.rules.length > 0) {
            const userAgent = res.headers.get("user-agent") || "";
            const country = res.headers.get("x-vercel-ip-country") || "";
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, "0");
            const minutes = String(now.getMinutes()).padStart(2, "0");
            const currentTimeStr = `${hours}:${minutes}`;

            for (const rule of Link.rules) {
                if (rule.type === "device") {
                    const uaLower = userAgent.toLowerCase();
                    const condLower = rule.condition.toLowerCase();
                    if (condLower === "ios" || condLower === "iphone" || condLower === "ipad") {
                        if (uaLower.includes("iphone") || uaLower.includes("ipad") || uaLower.includes("ipod")) {
                            targetUrl = rule.targetUrl;
                            break;
                        }
                    } else if (condLower === "android") {
                        if (uaLower.includes("android")) {
                            targetUrl = rule.targetUrl;
                            break;
                        }
                    } else if (condLower === "desktop") {
                        if (!uaLower.includes("mobile") && !uaLower.includes("android") && !uaLower.includes("iphone") && !uaLower.includes("ipad")) {
                            targetUrl = rule.targetUrl;
                            break;
                        }
                    }
                } else if (rule.type === "location") {
                    if (country && country.toUpperCase() === rule.condition.toUpperCase()) {
                        targetUrl = rule.targetUrl;
                        break;
                    }
                } else if (rule.type === "time") {
                    const parts = rule.condition.split("-");
                    if (parts.length === 2) {
                        const [start, end] = parts;
                        if (currentTimeStr >= start && currentTimeStr <= end) {
                            targetUrl = rule.targetUrl;
                            break;
                        }
                    }
                }
            }
        }

        return Response.redirect(targetUrl, 302);
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), { status: 500 });
    }
}