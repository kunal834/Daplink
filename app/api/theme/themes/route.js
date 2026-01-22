import { connectDB } from "@/lib/mongodb";
import theme from "@/models/Theme";

import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const themes = await theme.find({});
    return NextResponse.json(themes);
}

export async function POST(request) {
    await connectDB();
    if (!name || !tokens) {
        return NextResponse.json(
            { error: "Missing fields" },
            { status: 400 }
        );
    }
    const { name, tokens, isPremium } = await request.json();
    const newTheme = await theme.create({
        name,
        isPremium: !!isPremium,
        tokens
    });

    return NextResponse.json({
        message: "Theme created successfully",
        newTheme
    });
}

