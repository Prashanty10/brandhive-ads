import mongoose from "mongoose";

const adspaceSchema = new mongoose.Schema(
  {
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    displayType: {
      type: String,
      default: "Billboard",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    priceUnit: {
      type: String,
      default: "per month",
    },
    minimumBookingDuration: {
      type: String,
      default: "1 day",
    },
    dimensions: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: [],
    },
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "", index: true },
      state: { type: String, default: "" },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      geo: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    availability: {
      isAvailable: { type: Boolean, default: true, index: true },
      availableFrom: { type: Date },
      availableUntil: { type: Date },
    },
    audienceInformation: {
      type: [String],
      default: [],
    },
    estimatedDailyImpressions: {
      type: Number,
      default: 0,
    },
    estimatedFootfall: {
      type: Number,
      default: 0,
    },
    visibility: {
      type: String,
      default: "24 Hours",
    },
    lighting: {
      type: String,
      default: "Non-lit",
    },
    operatingHours: {
      type: String,
      default: "24 Hours",
    },
    sellerVerification: {
      type: Boolean,
      default: false,
    },
    sellerMobile: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    amenities: {
      type: [String],
      default: [],
    },
    bookingType: {
      type: String,
      enum: ["Instant Booking", "Request Booking"],
      default: "Instant Booking",
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive"],
      default: "active",
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

adspaceSchema.index({ "location.geo": "2dsphere" });
adspaceSchema.index({ status: 1, "availability.isAvailable": 1 });
adspaceSchema.index({ createdAt: -1 });

const AdSpace = mongoose.model("adspaces", adspaceSchema, "adspaces");

export default AdSpace;
