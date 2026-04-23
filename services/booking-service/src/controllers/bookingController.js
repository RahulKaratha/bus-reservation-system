import {
  createBooking,
  getBookingsByUser,
  getBookingById,
  cancelBooking,
  updatePaymentStatus,
} from "../services/bookingService.js";

export const bookSeats = async (req, res) => {
  try {
    const { busId, seats } = req.body;
    const userId = req.user.id;
    const token = req.headers.authorization.split(" ")[1];

    const booking = await createBooking(userId, busId, seats, token);
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await getBookingsByUser(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelMyBooking = async (req, res) => {
  try {
    const booking = await cancelBooking(req.params.id, req.user.id);
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateBookingPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, bookingStatus } = req.body;
    const booking = await updatePaymentStatus(req.params.id, paymentStatus, bookingStatus);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
