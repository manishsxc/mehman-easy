import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Enquiry } from "@/lib/models";
import { adminAuth } from "@/lib/firebaseAdmin";
import nodemailer from "nodemailer";

async function getEmailFromRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.email;
  } catch (e) {
    return null;
  }
}

function brandedEmail({ title, bodyHtml }) {
  return `
  <div style="font-family:Arial,sans-serif;background:#0E2529;padding:32px;">
    <div style="max-width:480px;margin:0 auto;background:#FBF8F0;border-radius:14px;overflow:hidden;">
      <div style="background:#0E2529;padding:20px 24px;">
        <span style="color:#E3C687;font-size:18px;font-weight:700;">EV</span>
      </div>
      <div style="padding:24px;color:#0E2529;">
        <h2 style="margin:0 0 12px;">${title}</h2>
        ${bodyHtml}
      </div>
    </div>
  </div>`;
}

export async function GET(req) {
  try {
    await dbConnect();
    const email = await getEmailFromRequest(req);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const enquiriesList = await Enquiry.find({ sellerEmail: email }).sort({ createdAt: -1 });

    return NextResponse.json({ enquiries: enquiriesList });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json({ error: error.message || "Failed to load enquiries." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const payload = await req.json();
    const { propertyId, sellerEmail, buyerName, buyerEmail, buyerPhone, message, propertyLink, propertyTitle } = payload;

    if (!propertyId || !sellerEmail || !buyerName || !buyerEmail || !buyerPhone) {
      return NextResponse.json({ error: "Required fields are missing." }, { status: 400 });
    }

    const newEnquiry = await Enquiry.create({
      propertyId,
      sellerEmail,
      buyerName,
      buyerEmail,
      buyerPhone,
      message,
      propertyLink,
    });

    // Send emails using Nodemailer
    const GMAIL_EMAIL = process.env.GMAIL_EMAIL;
    const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

    if (GMAIL_EMAIL && GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: GMAIL_EMAIL, pass: GMAIL_APP_PASSWORD },
      });

      // Email to Seller
      await transporter.sendMail({
        from: `EV <${GMAIL_EMAIL}>`,
        to: sellerEmail,
        subject: `New enquiry: ${buyerName} is interested in your listing`,
        html: brandedEmail({
          title: "You've got a new enquiry",
          bodyHtml: `
            <p><strong>${buyerName}</strong> sent an enquiry about your property "${propertyTitle || 'Property Listing'}".</p>
            <p>Email: ${buyerEmail}<br/>Phone: ${buyerPhone}</p>
            <p style="background:#EAE2CC;padding:12px;border-radius:8px;">${message || 'Hi, I am interested. Please share more details.'}</p>
            <p><a href="${propertyLink}" style="color:#9C7A34;">View the listing</a></p>
          `,
        }),
      });

      // Confirmation to Buyer
      await transporter.sendMail({
        from: `EV <${GMAIL_EMAIL}>`,
        to: buyerEmail,
        subject: "We've sent your enquiry to the seller",
        html: brandedEmail({
          title: "Enquiry confirmed",
          bodyHtml: `
            <p>Hi ${buyerName}, your enquiry has been sent to the seller. They'll be in touch with you directly at ${buyerEmail} or ${buyerPhone}.</p>
            <p><a href="${propertyLink}" style="color:#9C7A34;">View the listing again</a></p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json({ error: error.message || "Failed to submit enquiry." }, { status: 500 });
  }
}
