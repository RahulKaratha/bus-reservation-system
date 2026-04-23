import axios from "axios";
import Payment from "../models/Payment.js";
import { simulatePayment } from "../utils/simulatePayment.js";

export const processPayment = async (bookingId, amount, token, notificationData) => {
  const result = simulatePayment();

  const payment = new Payment({
    bookingId,
    amount,
    status: result.status,
    transactionId: result.transactionId,
  });

  await payment.save();

  // Update booking status
  await axios.patch(
    `${process.env.BOOKING_SERVICE_URL}/api/booking/${bookingId}/payment-status`,
    {
      paymentStatus: result.status === "success" ? "paid" : "failed",
      bookingStatus: result.status === "success" ? "confirmed" : "cancelled",
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // Send booking confirmation email on success
  if (result.status === "success" && notificationData) {
    await axios.post(
      `${process.env.NOTIFICATION_SERVICE_URL}/api/notification/booking-confirmation`,
      {
        email: notificationData.email,
        bus: notificationData.busRoute,
        seats: notificationData.seats,
        amount: notificationData.amount,
      }
    ).catch(() => {}); // Non-blocking — don't fail payment if notification fails
  }

  return payment;
};

export const getPaymentByBooking = async (bookingId) => {
  return await Payment.findOne({ bookingId });
};
