import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true
  },

  busId: {
    type: String,
    required: true
  },

  seats: {
    type: [Number],
    required: true
  },

  bookingStatus: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  }

},
{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);