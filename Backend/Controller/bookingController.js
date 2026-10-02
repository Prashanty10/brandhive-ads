import Booking from "../Models/bookingModel.js";
import AdSpace from "../Models/adspaceModel.js";
import paginate from "../Utils/pagination.js";

// 1. CREATE BOOKING (BUYER)
export const createBooking = async (req, res) => {
  try {
    const { adspaceID, startDate, endDate, notes } = req.body;
    const buyerID = req.user?.id || req.user?._id;

    if (!buyerID) {
      return res.status(401).json({ success: false, message: "Unauthorized: User token required" });
    }

    if (!adspaceID) {
      return res.status(400).json({ success: false, message: "Ad space ID is required for booking." });
    }

    const adspace = await AdSpace.findById(adspaceID);
    if (!adspace) {
      return res.status(404).json({ success: false, message: "Advertisement space not found." });
    }

    if (adspace.status !== "active") {
      return res.status(400).json({ success: false, message: "This advertisement space is currently inactive." });
    }

    if (!adspace.availability?.isAvailable) {
      return res.status(400).json({ success: false, message: "This advertisement space is currently unavailable for booking." });
    }

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days default

    const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    const totalPrice = (adspace.price || 0) * (adspace.priceUnit === "per day" ? diffDays : Math.ceil(diffDays / 30));

    const bookingStatus = adspace.bookingType === "Instant Booking" ? "Active" : "Pending";

    const booking = await Booking.create({
      buyerID,
      sellerID: adspace.sellerID,
      adspaceID,
      startDate: start,
      endDate: end,
      totalPrice,
      status: bookingStatus,
      bookingType: adspace.bookingType || "Instant Booking",
      notes: notes || "",
    });

    // Increment bookings count on adspace
    adspace.bookings = (adspace.bookings || 0) + 1;
    await adspace.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate("adspaceID")
      .populate("sellerID", "firstName lastName name email mobile");

    res.status(201).json({
      success: true,
      message: "Booking submitted successfully!",
      data: populatedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to create booking." });
  }
};

// 2. GET BUYER BOOKINGS
export const getBuyerBookings = async (req, res) => {
  try {
    const buyerID = req.user?.id || req.user?._id;
    if (!buyerID) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const filter = { buyerID };
    if (req.query.status) filter.status = req.query.status;

    const result = await paginate(Booking, filter, {
      reqQuery: req.query,
      populateOptions: [
        { path: "adspaceID" },
        { path: "sellerID", select: "firstName lastName name email mobile" },
      ],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching buyer bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET SELLER BOOKINGS (INCOMING REQUESTS & CONFIRMATIONS)
export const getSellerBookings = async (req, res) => {
  try {
    const sellerID = req.user?.id || req.user?._id;
    if (!sellerID) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const filter = { sellerID };
    if (req.query.status) filter.status = req.query.status;

    const result = await paginate(Booking, filter, {
      reqQuery: req.query,
      populateOptions: [
        { path: "adspaceID" },
        { path: "buyerID", select: "firstName lastName name email mobile profileImage" },
      ],
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching seller bookings:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE BOOKING STATUS (SELLER CONFIRMATION / REJECTION)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const sellerID = req.user?.id || req.user?._id;

    if (!["Active", "Pending", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.sellerID.toString() !== sellerID.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You are not the seller of this booking." });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await Booking.findById(id)
      .populate("adspaceID")
      .populate("buyerID", "firstName lastName name email mobile profileImage");

    res.status(200).json({
      success: true,
      message: `Booking request updated to ${status}.`,
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. CANCEL BOOKING (BUYER)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const buyerID = req.user?.id || req.user?._id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    if (booking.buyerID.toString() !== buyerID.toString()) {
      return res.status(403).json({ success: false, message: "Forbidden: You cannot cancel another user's booking." });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully.",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  createBooking,
  getBuyerBookings,
  getSellerBookings,
  updateBookingStatus,
  cancelBooking,
};
