import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Property } from "@/lib/models";
import { adminAuth } from "@/lib/firebaseAdmin";

async function getUidFromRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split("Bearer ")[1];
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.uid;
  } catch (e) {
    return null;
  }
}

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    return NextResponse.json({ property });
  } catch (error) {
    console.error("Error fetching property details:", error);
    return NextResponse.json({ error: error.message || "Failed to load property details." }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    if (property.ownerUid !== uid) {
      return NextResponse.json({ error: "Forbidden: You are not the owner of this property." }, { status: 403 });
    }

    const payload = await req.json();

    // Map properties standard fields and coordinates to Point schema if provided
    const updateData = { ...payload };
    if (payload.lat !== undefined && payload.lng !== undefined) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(payload.lng || 0), Number(payload.lat || 0)],
      };
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, property: updatedProperty });
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json({ error: error.message || "Failed to update property." }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const property = await Property.findById(id);
    if (!property) {
      return NextResponse.json({ error: "Property not found." }, { status: 404 });
    }

    if (property.ownerUid !== uid) {
      return NextResponse.json({ error: "Forbidden: You are not the owner of this property." }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json({ error: error.message || "Failed to delete property." }, { status: 500 });
  }
}
