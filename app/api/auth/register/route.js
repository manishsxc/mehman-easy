import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Otp } from "@/lib/models";
import nodemailer from "nodemailer";
import crypto from "crypto";

function hashCode(code) {
  return crypto.createHash("sha256").update(code).digest("hex");
}

function brandedEmail({ title, bodyHtml }) {
  return `
  <div style="font-family:Arial,sans-serif;background:#0E2529;padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#FBF8F0;border-radius:14px;overflow:hidden;">
      <div style="background:#0E2529;padding:20px 24px;">
        <span style="color:#E3C687;font-size:18px;font-weight:700;">Mehmaan <i style="color:#C79A4B;">Easy</i></span>
      </div>
      <div style="padding:24px;color:#0E2529;">
        <h2 style="margin:0 0 12px;">${title}</h2>
        ${bodyHtml}
      </div>
    </div>
  </div>`;
}

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Upsert OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email: cleanEmail },
      {
        codeHash: hashCode(code),
        expiresAt,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    // Setup Nodemailer transporter using GMAIL configs from environment
    const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (!GMAIL_EMAIL || !GMAIL_APP_PASSWORD) {
      console.warn("Gmail settings missing. Printing OTP to console:", code);
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
      });

      await transporter.sendMail({
        from: `Mehmaan Easy <${GMAIL_EMAIL}>`,
        to: cleanEmail,
        subject: "Your Mehmaan Easy verification code",
        html: brandedEmail({
          title: "Verify your email",
          bodyHtml: `
            <p>Your boarding code is:</p>
            <p style="font-size:32px;letter-spacing:8px;font-weight:700;color:#0E2529;">${code}</p>
            <p style="color:#5a5a5a;font-size:13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
          `,
        }),
      });
    }

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP." }, { status: 500 });
  }
}
