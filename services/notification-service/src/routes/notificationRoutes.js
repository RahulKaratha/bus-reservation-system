import express from "express";
import {
  sendResetEmail,
  sendBookingEmail
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/reset-password", sendResetEmail);
router.post("/booking-confirmation", sendBookingEmail);

export default router;