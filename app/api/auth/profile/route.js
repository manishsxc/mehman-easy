import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { User } from "@/lib/models";
import { adminAuth } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(req) {

  try {
    await dbConnect();
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 });
    }
    const token = authHeader.split("Bearer ")[1];
    
    // Verify ID token from Firebase Client SDK
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await User.findOne({ uid: decodedToken.uid });
    
    if (!userDoc) {
      return NextResponse.json({ error: "User profile not found in MongoDB." }, { status: 404 });
    }

    return NextResponse.json({ profile: userDoc });
  } catch (error) {
    console.error("Error retrieving user profile:", error);
    return NextResponse.json({ error: error.message || "Failed to load user profile." }, { status: 500 });
  }
}
