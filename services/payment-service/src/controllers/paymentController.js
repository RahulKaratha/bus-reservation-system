import { processPayment, getPaymentByBooking } from "../services/paymentService.js";

export const makePayment = async (req, res) => {
  try {
    const { bookingId, amount, notificationData } = req.body;
    const token = req.headers.authorization.split(" ")[1];

    // Attach user email from JWT to notification data
    const enrichedNotificationData = notificationData
      ? { ...notificationData, email: req.user.email }
      : null;

    const payment = await processPayment(bookingId, amount, token, enrichedNotificationData);
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPayment = async (req, res) => {
  try {
    const payment = await getPaymentByBooking(req.params.bookingId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
