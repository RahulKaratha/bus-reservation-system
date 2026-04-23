import axios from "axios";
import Booking from "../models/Booking.js";

export const createBooking = async (userId, busId, seats, token) => {
  const busRes = await axios.get(
    `${process.env.BUS_SERVICE_URL}/api/bus/${busId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  const bus = busRes.data;

  if (bus.availableSeats < seats.length) {
    throw new Error("Not enough seats available");
  }

  const booking = new Booking({
    userId,
    busId,
    seats,
    bookingStatus: "pending",
    paymentStatus: "pending",
  });

  await booking.save();

  // Trigger payment — total amount = price per seat * number of seats
  await axios.post(
    `${process.env.PAYMENT_SERVICE_URL}/api/payment/process`,
    {
      bookingId: booking._id,
      amount: bus.price * seats.length,
      // Pass notification data so payment-service can notify on completion
      notificationData: {
        busRoute: `${bus.source} → ${bus.destination}`,
        seats,
        amount: bus.price * seats.length
      }
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return booking;
};

export const getBookingsByUser = async (userId) => {
  return await Booking.find({ userId });
};

export const getBookingById = async (id) => {
  return await Booking.findById(id);
};

export const cancelBooking = async (id, userId) => {
  const booking = await Booking.findOne({ _id: id, userId });

  if (!booking) throw new Error("Booking not found");
  if (booking.bookingStatus === "cancelled") throw new Error("Already cancelled");

  booking.bookingStatus = "cancelled";
  return await booking.save();
};

export const updatePaymentStatus = async (id, paymentStatus, bookingStatus) => {
  return await Booking.findByIdAndUpdate(
    id,
    { paymentStatus, bookingStatus },
    { new: true }
  );
};
