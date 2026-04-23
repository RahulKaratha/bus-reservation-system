import express from "express";
import { makePayment, getPayment } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/process", protect, makePayment);
router.get("/:bookingId", protect, getPayment);

export default router;
