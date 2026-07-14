/**
 * Seeds MongoDB with a seller user doc + 50+ demo properties, all owned by
 * the seller account specified in SELLER_EMAIL below.
 *
 * Setup:
 *   1. Ensure MONGODB_URI is configured in .env.local
 *   2. Run `npm run seed`
 */
const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Initialize Firebase Admin (Only for obtaining/creating seller UID)
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_JSON || "sa.json";
try {
  const serviceAccount = require(path.resolve(__dirname, "..", serviceAccountPath));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} catch (e) {
  console.warn("Could not load service account from JSON, attempting default credentials:", e.message);
  admin.initializeApp();
}


const SELLER_EMAIL = "sumitranjanhisu@gmail.com";
const SELLER_NAME = "Sumit Ranjan";
const SELLER_PHONE = "+91 90000 00000";

const CITIES = [
  { city: "Bhubaneswar", pincode: "751001", lat: 20.2961, lng: 85.8245 },
  { city: "Cuttack", pincode: "753001", lat: 20.4625, lng: 85.8828 },
  { city: "Hyderabad", pincode: "500081", lat: 17.385, lng: 78.4867 },
  { city: "Bengaluru", pincode: "560034", lat: 12.9716, lng: 77.5946 },
  { city: "Pune", pincode: "411045", lat: 18.5204, lng: 73.8567 },
  { city: "Mumbai", pincode: "400050", lat: 19.076, lng: 72.8777 },
  { city: "Delhi", pincode: "110001", lat: 28.6139, lng: 77.209 },
  { city: "Chennai", pincode: "600002", lat: 13.0827, lng: 80.2707 },
  { city: "Kolkata", pincode: "700016", lat: 22.5726, lng: 88.3639 },
  { city: "Jaipur", pincode: "302001", lat: 26.9124, lng: 75.7873 },
];

const CATEGORIES = ["Residential", "Commercial", "Land", "Rental"];

const RESIDENTIAL_TITLES = [
  "Sunrise Meadows 3BHK Apartment",
  "Green Valley Independent House",
  "Lakeview Duplex Villa",
  "Silver Oak Residency Flat",
  "Palm Grove Garden Apartment",
  "Riverside Homes Cottage",
  "Maple Heights Penthouse",
  "Orchid Enclave Studio Flat",
];
const COMMERCIAL_TITLES = [
  "Prime Street-Facing Retail Shop",
  "Grade-A Office Space",
  "Corner Plot Showroom",
  "Fully Fitted IT Office Floor",
  "High-Footfall Restaurant Space",
];
const LAND_TITLES = [
  "Open Residential Plot",
  "Corner Plot Near Highway",
  "Agricultural Land Parcel",
  "Gated Community Plot",
  "Riverfront Land",
];
const RENTAL_TITLES = [
  "Furnished 2BHK for Rent",
  "Bachelor-Friendly Studio for Rent",
  "Family Home for Rent",
  "Co-living PG Room",
  "Fully Furnished Office for Rent",
];

const AMENITY_POOL = ["Parking", "Lift", "Power backup", "Security", "Gym", "Garden", "Swimming pool", "Furnished"];
const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=70",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=900&q=70",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=70",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=70",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=70",
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickN(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}
function jitter(v, spread = 0.06) {
  return v + (Math.random() - 0.5) * spread;
}

function titleFor(category) {
  if (category === "Residential") return pick(RESIDENTIAL_TITLES);
  if (category === "Commercial") return pick(COMMERCIAL_TITLES);
  if (category === "Land") return pick(LAND_TITLES);
  return pick(RENTAL_TITLES);
}

function priceFor(category, area) {
  const perSqft = { Residential: 4200, Commercial: 7800, Land: 2600, Rental: 35 }[category];
  const base = area * perSqft;
  return category === "Rental" ? Math.round(base / 10) : Math.round(base);
}

function buildProperty(i, sellerUid) {
  const loc = pick(CITIES);
  const category = CATEGORIES[i % CATEGORIES.length];
  const area = Math.round(600 + Math.random() * 2400);
  const bedrooms = category === "Residential" || category === "Rental" ? 1 + (i % 4) : 0;
  const bathrooms = bedrooms ? Math.max(1, bedrooms - 1) : 0;
  const latVal = jitter(loc.lat);
  const lngVal = jitter(loc.lng);

  return {
    ownerUid: sellerUid,
    ownerEmail: SELLER_EMAIL,
    title: `${titleFor(category)} — ${loc.city}`,
    description:
      `A well-maintained ${category.toLowerCase()} property in ${loc.city}, ideal for ${
        category === "Commercial" ? "businesses looking for visibility" : "families and investors alike"
      }. Close to schools, markets, and transit links, with clean documentation and immediate availability.`,
    category,
    price: priceFor(category, area),
    area,
    bedrooms,
    bathrooms,
    amenities: pickN(AMENITY_POOL, 2 + (i % 3)),
    images: pickN(IMAGE_POOL, 2),
    address: `${100 + i}, ${loc.city} Main Road`,
    city: loc.city,
    pincode: loc.pincode,
    lat: latVal,
    lng: lngVal,
    location: {
      type: "Point",
      coordinates: [lngVal, latVal],
    },
    status: "active",
    isFeatured: i % 9 === 0, // a handful of ad-eligible listings
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function seed() {
  let sellerUid;
  try {
    const authUser = await admin.auth().getUserByEmail(SELLER_EMAIL);
    sellerUid = authUser.uid;
  } catch {
    const created = await admin.auth().createUser({
      email: SELLER_EMAIL,
      password: "MehmaanEasy@123",
      displayName: SELLER_NAME,
      emailVerified: true,
    });
    sellerUid = created.uid;
    console.log(`Created Auth user for ${SELLER_EMAIL} (temp password: MehmaanEasy@123)`);
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db();

  // Create geo index on properties collection
  await db.collection("properties").createIndex({ location: "2dsphere" });

  // Update/upsert User document in MongoDB
  await db.collection("users").updateOne(
    { uid: sellerUid },
    {
      $set: {
        uid: sellerUid,
        name: SELLER_NAME,
        email: SELLER_EMAIL,
        phone: SELLER_PHONE,
        place: "Bhubaneswar",
        pincode: "751001",
        verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );
  console.log(`Seller profile seed completed in MongoDB users collection.`);

  // Delete previous seed properties from this owner
  await db.collection("properties").deleteMany({ ownerEmail: SELLER_EMAIL });
  console.log("Cleared old seeded properties from MongoDB.");

  const properties = [];
  const total = 54;
  for (let i = 0; i < total; i++) {
    properties.push(buildProperty(i, sellerUid));
  }

  await db.collection("properties").insertMany(properties);
  console.log(`Successfully seeded ${total} properties for ${SELLER_EMAIL} in MongoDB.`);

  await client.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
