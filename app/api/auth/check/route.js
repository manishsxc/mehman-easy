import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();
    const cleanEmail = (email || "").trim().toLowerCase();

    if (!cleanEmail) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (!existingUser) {
      return NextResponse.json({ registered: false, error: "This email is not registered as a seller." }, { status: 404 });
    }

    return NextResponse.json({ registered: true });
  } catch (error) {
    console.error("Error checking user registration:", error);
    return NextResponse.json({ error: "Failed to check email registration." }, { status: 500 });
  }
}
