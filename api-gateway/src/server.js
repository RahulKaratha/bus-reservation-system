import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { authProxy } from "./routes/authProxy.js";
import { busProxy } from "./routes/busProxy.js";
import { bookingProxy } from "./routes/bookingProxy.js";
import { paymentProxy } from "./routes/paymentProxy.js";
import { userProxy } from "./routes/userProxy.js";
import { notificationProxy } from "./routes/notificationProxy.js";
import { logger } from "./middleware/logger.js";
import { protect } from "./middleware/authMiddleware.js";
import { globalLimiter, authLimiter } from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(logger);
app.use(globalLimiter);

// Route mapping
app.use("/api/auth", authLimiter, authProxy);
// Public bus routes (no auth required)
app.use("/api/bus/cities", busProxy);
app.use("/api/bus/search", busProxy);
// All other bus routes require auth
app.use("/api/bus", protect, busProxy);
app.use("/api/booking", protect, bookingProxy);
app.use("/api/payment", protect, paymentProxy);
app.use("/api/user", protect, userProxy);
app.use("/api/notification", notificationProxy);

// Health check
app.get("/", (req, res) => {
  res.send("API Gateway is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});