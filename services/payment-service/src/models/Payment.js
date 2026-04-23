import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
  bookingId: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending"
  },

  transactionId: {
    type: String
  }

},
{ timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);