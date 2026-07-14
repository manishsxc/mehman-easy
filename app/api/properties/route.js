import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Property } from "@/lib/models";
import { adminAuth } from "@/lib/firebaseAdmin";

// Helper function to extract user UID from auth token
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

export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);

    // Filter Query Params
    const keyword = url.searchParams.get("keyword") || "";
    const category = url.searchParams.get("category") || "All";
    const minPrice = url.searchParams.get("minPrice") ? Number(url.searchParams.get("minPrice")) : null;
    const maxPrice = url.searchParams.get("maxPrice") ? Number(url.searchParams.get("maxPrice")) : null;
    const bedrooms = url.searchParams.get("bedrooms") ? Number(url.searchParams.get("bedrooms")) : null;
    const minArea = url.searchParams.get("minArea") ? Number(url.searchParams.get("minArea")) : null;
    const ownerUid = url.searchParams.get("ownerUid") || "";
    const lat = url.searchParams.get("lat") ? Number(url.searchParams.get("lat")) : null;
    const lng = url.searchParams.get("lng") ? Number(url.searchParams.get("lng")) : null;

    const query = {};

    // Only active properties, unless looking up owner listings specifically
    if (ownerUid) {
      query.ownerUid = ownerUid;
    } else {
      query.status = "active";
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (minPrice !== null || maxPrice !== null) {
      query.price = {};
      if (minPrice !== null) query.price.$gte = minPrice;
      if (maxPrice !== null) query.price.$lte = maxPrice;
    }

    if (bedrooms !== null) {
      query.bedrooms = { $gte: bedrooms };
    }

    if (minArea !== null) {
      query.area = { $gte: minArea };
    }

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { title: regex },
        { city: regex },
        { address: regex },
        { pincode: regex },
      ];
    }

    let propertiesList = [];

    // Geospatial nearby matching, or fallback to newest first
    if (lat !== null && lng !== null && !ownerUid) {
      // Find properties within range or sort by distance
      propertiesList = await Property.find(query).near("location", {
        center: { type: "Point", coordinates: [lng, lat] },
        spherical: true,
      });
    } else {
      propertiesList = await Property.find(query).sort({ createdAt: -1 });
    }

    return NextResponse.json({ properties: propertiesList });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json({ error: error.message || "Failed to load properties." }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const uid = await getUidFromRequest(req);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const payload = await req.json();

    // Map properties standard fields and coordinates to Point schema
    const coordinates = [Number(payload.lng || 0), Number(payload.lat || 0)];

    const newProperty = await Property.create({
      ...payload,
      ownerUid: uid,
      location: {
        type: "Point",
        coordinates: coordinates,
      },
    });

    return NextResponse.json({ success: true, property: newProperty });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json({ error: error.message || "Failed to create property." }, { status: 500 });
  }
}
