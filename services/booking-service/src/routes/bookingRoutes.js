import express from "express";
import {
  bookSeats,
  getMyBookings,
  getBooking,
  cancelMyBooking,
  updateBookingPaymentStatus,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, bookSeats);
router.get("/my", protect, getMyBookings);
router.get("/:id", protect, getBooking);
router.patch("/:id/cancel", protect, cancelMyBooking);

// Internal route called by payment-service
router.patch("/:id/payment-status", updateBookingPaymentStatus);

export default router;
