import { connectDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/resend";

export async function POST(req) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken =
      crypto.randomBytes(32).toString("hex");

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,

      emailVerified: false,

      verificationToken,

      verificationTokenExpires: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    const verificationLink =
      `${process.env.NEXT_PUBLIC_HOST}/verify-email?token=${verificationToken}`;

    const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Verify your email</title>
</head>

<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 20px;">

<table width="600" cellpadding="0" cellspacing="0"
style="
background:#ffffff;
border-radius:12px;
overflow:hidden;
border:1px solid #e5e5e5;
">

<tr>
<td align="center" style="padding:40px 20px 20px;">

<img
src="https://daplink.vercel.app/innovate.png"
alt="Daplink"
width="64"
style="display:block;margin-bottom:2px;"
/>

<h1 style="
margin:0;
font-size:28px;
color:#1d5f8c;
font-weight:700;
">
Daplink
</h1>

</td>
</tr>

<tr>
<td style="padding:20px 40px;">

<h2 style="
margin-top:0;
color:#111827;
font-size:24px;
">
Verify your email address
</h2>

<p style="
font-size:16px;
line-height:26px;
color:#4b5563;
">
Hi ${name || "there"},
</p>

<p style="
font-size:16px;
line-height:26px;
color:#4b5563;
">
Welcome to Daplink. Please verify your email address to activate your account.
</p>

<div style="text-align:center;margin:40px 0;">

<a
href="${verificationLink}"
style="
display:inline-block;
padding:14px 32px;
background:#1d5f8c;
color:#ffffff;
text-decoration:none;
font-weight:600;
border-radius:8px;
"
>
Verify Email
</a>

</div>

<p style="
font-size:14px;
line-height:22px;
color:#6b7280;
">
If the button doesn't work, copy and paste this link:
</p>

<p style="
word-break:break-all;
font-size:13px;
color:#1d5f8c;
">
${verificationLink}
</p>

<hr style="
border:none;
border-top:1px solid #e5e7eb;
margin:30px 0;
">

<p style="
font-size:13px;
color:#9ca3af;
line-height:22px;
">
This verification link expires in 24 hours.
</p>

<p style="
font-size:13px;
color:#9ca3af;
line-height:22px;
">
If you didn't create a Daplink account, you can safely ignore this email.
</p>

</td>
</tr>

<tr>
<td
align="center"
style="
padding:20px;
background:#fafafa;
font-size:12px;
color:#9ca3af;
"
>
© ${new Date().getFullYear()} Daplink. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

    await sendEmail(
      newUser.email,
      "Verify your Daplink account",
      emailTemplate
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully. Please verify your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}