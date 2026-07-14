import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    phone: { type: String, required: true },
    place: { type: String, required: true },
    pincode: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Property Schema
const PropertySchema = new mongoose.Schema(
  {
    ownerUid: { type: String, required: true, index: true },
    ownerEmail: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Residential", "Commercial", "Land", "Rental"],
    },
    price: { type: Number, required: true },
    area: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    pincode: { type: String, required: true, index: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "sold", "inactive"],
      default: "active",
    },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Geospatial index for nearby queries: [lng, lat] format
PropertySchema.index({ location: "2dsphere" });

// Enquiry Schema
const EnquirySchema = new mongoose.Schema(
  {
    propertyId: { type: String, required: true, index: true },
    sellerEmail: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    message: { type: String },
    propertyLink: { type: String },
  },
  { timestamps: true }
);

// OTP Schema
const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
});

// Helper function to get model without recompiling
export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Property = mongoose.models.Property || mongoose.model("Property", PropertySchema);
export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", EnquirySchema);
export const Otp = mongoose.models.Otp || mongoose.model("Otp", OtpSchema);
