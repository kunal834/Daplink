import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";
import User from "@/models/user";
import { getDataFromToken } from "@/app/Helper/getDataFromToken";
export async function PUT(req) {
  try {
    const body = await req.json();
    await connectDB();

    let userIdFromToken;
    try {
      userIdFromToken = getDataFromToken(req);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Please authenticate first",
        },
        { status: 401 }
      );
    }

    const user = await User.findById(userIdFromToken).select("daplinkID");
    if (!user?.daplinkID) {
      return NextResponse.json(
        {
          success: false,
          message: "No profile found for this user",
        },
        { status: 404 }
      );
    }

    const has = (key) => Object.prototype.hasOwnProperty.call(body, key);
    const updatedData = {};
    const clamp = (value, min, max, fallback) => {
      const num = Number(value);
      if (Number.isNaN(num)) return fallback;
      return Math.min(max, Math.max(min, num));
    };

    if (has("handle")) {
      updatedData.handle = String(body.handle ?? "").trim().toLowerCase();
    }
    if (has("profile")) {
      updatedData.profile = String(body.profile ?? "").trim();
    }
    if (has("location")) {
      updatedData.location = String(body.location ?? "").trim();
    }
    if (has("profession")) {
      updatedData.profession = String(body.profession ?? "").trim();
    }
    if (has("theme")) {
      updatedData.theme = String(body.theme ?? "").trim();
    }
    if (has("themeConfig") && body.themeConfig && typeof body.themeConfig === "object") {
      const cfg = body.themeConfig;
      updatedData.themeConfig = {
        accent: String(cfg.accent ?? "#8b5cf6").trim() || "#8b5cf6",
        backgroundColor: String(cfg.backgroundColor ?? "#0f172a").trim() || "#0f172a",
        bgStyle: String(cfg.bgStyle ?? "soft").trim() || "soft",
        buttonStyle: String(cfg.buttonStyle ?? "solid").trim() || "solid",
        radius: clamp(cfg.radius, 8, 30, 18),
        blur: clamp(cfg.blur, 0, 24, 10),
        softText: Boolean(cfg.softText),
        font: String(cfg.font ?? "Inter, system-ui, sans-serif").trim() || "Inter, system-ui, sans-serif",
        customBackground: String(cfg.customBackground ?? "").trim(),
        layoutStyle: String(cfg.layoutStyle ?? "bento").trim() || "bento",
        cardStyle: String(cfg.cardStyle ?? "glass").trim() || "glass",
      };
    }
    if (has("script") || has("bio")) {
      updatedData.script = String((has("script") ? body.script : body.bio) ?? "");
    }
    if (has("links") && Array.isArray(body.links)) {
      updatedData.links = body.links
        .map((item) => ({
          link: String(item?.link ?? item?.url ?? "").trim(),
          linktext: String(item?.linktext ?? item?.title ?? "").trim(),
        }))
        .filter((item) => item.link && item.linktext);
    }
    if (has("aiConfig") && body.aiConfig && typeof body.aiConfig === "object") {
      const ai = body.aiConfig;
      updatedData.aiConfig = {
        aiEnabled: Boolean(ai.aiEnabled),
        aiPrompt: String(ai.aiPrompt ?? "Hi there! I'm an AI assistant. How can I help you today?").trim(),
        aiContext: String(ai.aiContext ?? "").trim(),
        aiFaqs: Array.isArray(ai.aiFaqs)
          ? ai.aiFaqs
              .map((f) => ({
                question: String(f?.question ?? "").trim(),
                answer: String(f?.answer ?? "").trim(),
              }))
              .filter((f) => f.question && f.answer)
          : []
      };
    }
    if (has("statusGlow")) {
      updatedData.statusGlow = String(body.statusGlow ?? "online").trim();
    }
    if (has("avatarBorder")) {
      updatedData.avatarBorder = String(body.avatarBorder ?? "classic").trim();
    }

    const updatedUser = await Link.findByIdAndUpdate(
      user.daplinkID,
      { $set: updatedData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "No profile found for this user ID. Check if the ID matches.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your profile updated successfully",
        updateduser: updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
