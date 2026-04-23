import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/payment", paymentRoutes);

app.get("/", (req, res) => {
  res.send("Payment Service Running");
});

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
});