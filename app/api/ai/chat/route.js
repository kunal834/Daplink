import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Link from "@/models/Link";

export async function POST(req) {
  try {
    await connectDB();
    const { handle, message, history = [] } = await req.json();

    if (!handle || !message) {
      return NextResponse.json(
        { success: false, message: "Handle and message are required" },
        { status: 400 }
      );
    }

    // Find the profile configuration
    const profile = await Link.findOne({ handle: handle.toLowerCase() });
    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 }
      );
    }

    const { aiConfig, profession = "Creator", location = "Remote", script = "", links = [], name = handle } = profile;
    const aiEnabled = aiConfig?.aiEnabled ?? false;

    if (!aiEnabled) {
      return NextResponse.json(
        { success: false, message: "AI assistant is disabled for this profile" },
        { status: 403 }
      );
    }

    const aiPrompt = aiConfig?.aiPrompt || "Hi there! I'm an AI assistant. How can I help you today?";
    const aiContext = aiConfig?.aiContext || "";
    const aiFaqs = aiConfig?.aiFaqs || [];

    // Format links text for context
    const linksListText = links
      .map((l) => `- ${l.linktext}: ${l.link}`)
      .join("\n");

    // Format FAQs text for context
    const faqsText = aiFaqs
      .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
      .join("\n\n");

    // Construct the persona and background for the AI
    const systemInstruction = `You are the AI Digital Twin of ${name} (@${handle}).
Your goal is to answer visitor questions conversationally and help them find what they are looking for.

Profile Background:
- Handle: @${handle}
- Display Name: ${name}
- Profession: ${profession}
- Location: ${location}
- Biography: ${script}

Additional Context / About Me:
${aiContext}

Frequently Asked Questions (FAQs):
${faqsText}

Available Links & Resources:
${linksListText}

Instructions:
1. Always stay in character as the AI assistant of ${name}.
2. Use the provided information (Biography, FAQs, Links, and Context) to answer questions.
3. If the user asks for a specific resource, social media account, or website, recommend the exact URL from the Available Links list. Provide the link clearly.
4. Keep answers professional, friendly, and concise. If you do not know the answer based on the context, politely invite them to connect or leave a message for ${name} directly.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Mock Fallback when no API Key is set in environment (Development Helper)
      console.warn("GEMINI_API_KEY is not defined in environment. Using development mock fallback.");
      
      let replyText = "";
      const lowerMsg = message.toLowerCase();

      if (lowerMsg.includes("hello") || lowerMsg.includes("hi") || lowerMsg.includes("hey")) {
        replyText = `${aiPrompt}\n\n*(Note: This is a placeholder response. To enable real AI intelligence, please add GEMINI_API_KEY to your .env.local file)*`;
      } else if (lowerMsg.includes("link") || lowerMsg.includes("website") || lowerMsg.includes("portfolio") || lowerMsg.includes("social")) {
        replyText = `Here are the available links for @${handle}:\n\n${linksListText || "No links configured yet."}\n\n*(Note: Add GEMINI_API_KEY to your .env.local for full conversational AI)*`;
      } else if (lowerMsg.includes("faq") || lowerMsg.includes("services") || lowerMsg.includes("price") || lowerMsg.includes("rate")) {
        if (aiFaqs.length > 0) {
          replyText = `Here are some FAQs for @${handle}:\n\n${faqsText}\n\n*(Note: Add GEMINI_API_KEY to your .env.local for full conversational AI)*`;
        } else {
          replyText = `@${handle} is a ${profession} located in ${location}. You can visit their links or chat with them directly!`;
        }
      } else {
        replyText = `Thank you for reaching out! I am @${handle}'s AI assistant. Currently in offline demo mode. 
Here is their profile info:
- Bio: ${script || "No bio set"}
- Profession: ${profession}
- Location: ${location}

*(Tip: Add a GEMINI_API_KEY in your .env.local to activate the live Gemini 2.5 Flash model!)*`;
      }

      return NextResponse.json({
        success: true,
        reply: replyText,
        mock: true
      });
    }

    // Call Gemini API
    // Format conversation history for Gemini API
    const contents = [];
    
    // Add history in Gemini format
    history.forEach((msg) => {
      const role = msg.role === "assistant" || msg.role === "model" ? "model" : "user";
      contents.push({
        role: role,
        parts: [{ text: msg.text }]
      });
    });

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: contents,
        systemInstruction: {
          parts: [{ text: systemInstruction }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `Gemini API returned status ${response.status}`);
    }

    const resJson = await response.json();
    const replyText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that response.";

    return NextResponse.json({
      success: true,
      reply: replyText.trim(),
      mock: false
    });

  } catch (error) {
    console.error("AI Chat API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
