import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import {
  createBooking,
  getBuyerBookings,
  getSellerBookings,
  updateBookingStatus,
  cancelBooking,
} from "../Controller/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/", authMiddleware, createBooking);
bookingRouter.get("/", authMiddleware, getBuyerBookings);
bookingRouter.get("/seller-bookings", authMiddleware, getSellerBookings);
bookingRouter.patch("/:id/status", authMiddleware, updateBookingStatus);
bookingRouter.patch("/:id/cancel", authMiddleware, cancelBooking);

export default bookingRouter;
