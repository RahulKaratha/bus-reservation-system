import mongoose from "mongoose";

const busSchema = new mongoose.Schema(
{
  busNumber: { type: String, required: true },
  operator:  { type: String },
  source:    { type: String, required: true },
  destination: { type: String, required: true },

  // Hour of day (0-23) the bus departs — combined with search date on the fly
  departureHour: { type: Number, required: true },
  // Journey duration in hours
  durationHours: { type: Number, required: true },

  totalSeats:     { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  price:          { type: Number, required: true }
},
{ timestamps: true }
);

export default mongoose.model("Bus", busSchema);
