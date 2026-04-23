import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => {
  res.send("Booking Service Running");
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, () => {
  console.log(`Booking service running on port ${PORT}`);
});