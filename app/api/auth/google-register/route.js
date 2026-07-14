import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    await dbConnect();
    const { uid, name, email, phone, place, pincode } = await req.json();

    if (!uid || !name || !email) {
      return NextResponse.json({ error: "UID, Name, and Email are required." }, { status: 400 });
    }

    // Check if user already exists
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json({ success: true, message: "User already registered." });
    }

    // Create the new User in MongoDB
    const newUser = await User.create({
      uid,
      name,
      email: email.trim().toLowerCase(),
      phone: phone || "Google User",
      place: place || "Not Specified",
      pincode: pincode || "000000",
      verified: true,
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error creating Google user profile in Mongo:", error);
    return NextResponse.json({ error: error.message || "Failed to save profile." }, { status: 500 });
  }
}
