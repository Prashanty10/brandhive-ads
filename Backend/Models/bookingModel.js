import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    buyerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    adspaceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "adspaces",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Pending", "Completed", "Cancelled"],
      default: "Active",
      index: true,
    },
    bookingType: {
      type: String,
      default: "Instant Booking",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

bookingSchema.index({ sellerID: 1, createdAt: -1 });
bookingSchema.index({ buyerID: 1, createdAt: -1 });
bookingSchema.index({ adspaceID: 1 });

const Booking = mongoose.model("bookings", bookingSchema, "bookings");

export default Booking;
